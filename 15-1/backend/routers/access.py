import base64
from datetime import datetime, timezone, timedelta, time as dt_time
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import numpy as np

from core.database import get_db
from core.models import User, FaceEmbedding, Access, OrganizationMember
from core.security import get_current_user
from schemas.access import (
    AccessCheckInRequest,
    AccessResponse,
    AccessListResponse,
    AccessStatsResponse,
    AccessStatsItem,
)
from services.face_recognition import extract_face_embedding, verify_face

router = APIRouter(prefix="/access", tags=["access"])


@router.post("/check-in", response_model=AccessResponse, status_code=status.HTTP_201_CREATED)
def check_in(
    payload: AccessCheckInRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        image_data = base64.b64decode(payload.image)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="잘못된 Base64 이미지 형식입니다.",
        )
    
    stored_embeddings = db.query(FaceEmbedding).filter(
        FaceEmbedding.user_id == current_user.id
    ).all()
    
    if len(stored_embeddings) == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="등록된 얼굴 데이터가 없습니다. 먼저 얼굴을 등록해주세요.",
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
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"얼굴 인증에 실패했습니다. (유사도: {similarity:.2f})",
        )
    
    org_member = db.query(OrganizationMember).filter(
        OrganizationMember.user_id == current_user.id
    ).first()
    
    kst = timezone(timedelta(hours=9))
    access = Access(
        user_id=current_user.id,
        organization_id=org_member.organization_id if org_member else None,
        check_in_time=datetime.now(kst),
        similarity=f"{similarity:.4f}",
        status="checked_in",
    )
    db.add(access)
    db.commit()
    db.refresh(access)
    
    return AccessResponse(
        id=access.id,
        userId=access.user_id,
        userName=current_user.name,
        organizationType=current_user.organization_type,
        checkInTime=access.check_in_time.isoformat(),
        similarity=float(similarity),
        status="checked_in",
        createdAt=access.created_at.isoformat(),
    )


@router.get("/history", response_model=AccessListResponse)
def get_access_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    limit: int = 50,
    offset: int = 0,
):
    accesses = db.query(Access).filter(
        Access.user_id == current_user.id
    ).order_by(Access.check_in_time.desc()).limit(limit).offset(offset).all()
    
    total = db.query(Access).filter(
        Access.user_id == current_user.id
    ).count()
    
    items = [
        AccessResponse(
            id=access.id,
            userId=access.user_id,
            userName=current_user.name,
            organizationType=current_user.organization_type,
            checkInTime=access.check_in_time.isoformat(),
            similarity=float(access.similarity) if access.similarity else None,
            status=access.status if access.status else "checked_in",
            createdAt=access.created_at.isoformat(),
        )
        for access in accesses
    ]
    
    return AccessListResponse(total=total, items=items)


@router.get("/stats", response_model=AccessStatsResponse)
def get_access_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    period: str = "day",
):        
    accesses = db.query(Access).filter(
        Access.user_id == current_user.id
    ).all()
    
    if not accesses:
        return AccessStatsResponse(period=period, items=[])
    
    stats_dict = {}
    
    for access in accesses:
        check_time = access.check_in_time
        check_hour_value = check_time.hour + check_time.minute / 60.0
        
        if period == "minute":
            key = check_time.strftime("%Y-%m-%d %H:%M")
            label = check_time.strftime("%H:%M")
        elif period == "hour":
            key = check_time.strftime("%Y-%m-%d %H:00")
            label = check_time.strftime("%H:00")
        elif period == "day":
            key = check_time.strftime("%Y-%m-%d")
            label = check_time.strftime("%m/%d")
        elif period == "month":
            key = check_time.strftime("%Y-%m")
            label = check_time.strftime("%Y년 %m월")
        elif period == "year":
            key = check_time.strftime("%Y")
            label = check_time.strftime("%Y년")
        else:
            key = check_time.strftime("%Y-%m-%d")
            label = check_time.strftime("%m/%d")
        
        if key not in stats_dict:
            stats_dict[key] = {
                "label": label,
                "count": 0,
                "date": key,
                "firstCheckIn": check_hour_value,
            }
        
        stats_dict[key]["count"] += 1
        if check_hour_value < stats_dict[key]["firstCheckIn"]:
            stats_dict[key]["firstCheckIn"] = check_hour_value
    
    items = sorted(
        [AccessStatsItem(**stats_dict[key]) for key in sorted(stats_dict.keys())],
        key=lambda x: x.date
    )
    
    return AccessStatsResponse(period=period, items=items)

