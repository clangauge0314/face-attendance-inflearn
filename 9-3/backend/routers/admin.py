import base64
from fastapi import APIRouter, Depends, HTTPException, Query, Request, status
from sqlalchemy.orm import Session
import numpy as np

from core.database import get_db
from core.models import User, FaceEmbedding, AdminLoginLog
from datetime import datetime, timezone, timedelta
from core.security import (
    create_access_token,
    get_current_user,
    hash_password,
    verify_password,
)
from schemas import TokenResponse, UserResponse
from schemas.admin import (
    AdminLoginRequest,
    AdminLoginLogResponse,
    AdminFacePreviewRequest,
    AdminFacePreviewResponse,
    AdminDashboardStatsResponse,
    AdminUserResponse,
    AdminAttendanceHistoryResponse,
    AdminAttendanceStatsResponse,
    AdminAttendanceStatsItem,
)
from services.face_recognition import extract_face_embedding, verify_face

router = APIRouter(prefix="/admin", tags=["admin"])

def get_current_admin(
    current_user: User = Depends(get_current_user),
) -> User:
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="관리자 권한이 필요합니다.",
        )
    return current_user


@router.post("/login", response_model=TokenResponse)
def admin_login(
    payload: AdminLoginRequest,
    request: Request = None,
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.user_id == payload.userId).first()
    if not user or not verify_password(payload.password, user.password_hash):
        if user:
            login_log = AdminLoginLog(
                user_id=user.id,
                ip_address=request.client.host if request else None,
                user_agent=request.headers.get("user-agent") if request else None,
                face_verified="false",
                status="failed",
            )
            db.add(login_log)
            db.commit()
        
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="아이디 또는 비밀번호가 올바르지 않습니다.",
        )

    if user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="관리자 권한이 없습니다.",
        )

    face_verified = "false"
    similarity_value = None
    
    stored_embeddings = db.query(FaceEmbedding).filter(
        FaceEmbedding.user_id == user.id
    ).all()
    
    if len(stored_embeddings) > 0:
        if not payload.image:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="얼굴 인식이 필요합니다. 얼굴 이미지를 제공해주세요.",
            )
        
        try:
            image_data = base64.b64decode(payload.image)
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="잘못된 Base64 이미지 형식입니다.",
            )
        
        current_embedding = extract_face_embedding(image_data)
        
        if current_embedding is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="얼굴을 감지할 수 없습니다. 카메라를 정면으로 바라보세요.",
            )
        
        stored_embeddings_list = [np.array(emb.embedding) for emb in stored_embeddings]
        verified, similarity = verify_face(current_embedding, stored_embeddings_list, threshold=0.70)
        
        if not verified:
            login_log = AdminLoginLog(
                user_id=user.id,
                ip_address=request.client.host if request else None,
                user_agent=request.headers.get("user-agent") if request else None,
                face_verified="true",
                similarity=f"{similarity:.4f}",
                status="failed",
            )
            db.add(login_log)
            db.commit()
            
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"얼굴 인증에 실패했습니다. 유사도: {similarity:.2%}",
            )
        
        face_verified = "true"
        similarity_value = f"{similarity:.4f}"
    else:
        pass

    login_log = AdminLoginLog(
        user_id=user.id,
        ip_address=request.client.host if request else None,
        user_agent=request.headers.get("user-agent") if request else None,
        face_verified=face_verified,
        similarity=similarity_value,
        status="success",
    )
    db.add(login_log)
    db.commit()

    access_token = create_access_token({"sub": user.user_id, "role": "admin"})
    return TokenResponse(
        access_token=access_token,
        user=UserResponse(
            id=user.id,
            organizationType=user.organization_type, 
            name=user.name,
            userId=user.user_id,
            role=user.role,
            createdAt=user.created_at,
        ),
    )


@router.post("/face-preview", response_model=AdminFacePreviewResponse)
def admin_face_preview(
    payload: AdminFacePreviewRequest,
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.user_id == payload.userId).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="사용자를 찾을 수 없습니다.",
        )

    if user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="관리자 계정이 아닙니다.",
        )

    stored_embeddings = db.query(FaceEmbedding).filter(
        FaceEmbedding.user_id == user.id
    ).all()

    if len(stored_embeddings) == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="등록된 얼굴 데이터가 없습니다. 먼저 얼굴을 등록해주세요.",
        )

    try:
        image_data = base64.b64decode(payload.image)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="잘못된 Base64 이미지 형식입니다.",
        )

    current_embedding = extract_face_embedding(image_data)

    if current_embedding is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="얼굴을 감지할 수 없습니다. 카메라를 정면으로 바라보세요.",
        )

    stored_embeddings_list = [np.array(emb.embedding) for emb in stored_embeddings]
    verified, similarity = verify_face(current_embedding, stored_embeddings_list, threshold=0.70)

    return AdminFacePreviewResponse(
        similarity=float(similarity),
        verified=verified,
    )


@router.get("/me", response_model=UserResponse)
def admin_me(current_admin: User = Depends(get_current_admin)):
    return UserResponse(
        id=current_admin.id,
        organizationType=current_admin.organization_type,  
        name=current_admin.name,
        userId=current_admin.user_id,
        role=current_admin.role,
        createdAt=current_admin.created_at,
    )