import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  listOrganizations,
  getOrganization,
  createOrganization,
  type OrganizationResponse,
  type OrganizationDetailResponse,
} from '../api/organization'
import { PageHeader } from "../components/common/page-header";

import { OrganizationList } from "../components/admin/organization/organization-list";
import { CreateOrganizationModal } from "../components/admin/organization/create-organization-modal";

export const OrganizationManagementPage = () => {
  const [organizations, setOrganizations] = useState<OrganizationResponse[]>([])
  const [selectedOrg, setSelectedOrg] = useState<OrganizationDetailResponse | null>(null)


  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newOrgName, setNewOrgName] = useState("");
  const [newOrgType, setNewOrgType] = useState("company");

  useEffect(() => {
    loadOrganizations()
  }, [])

  const loadOrganizations = async () => {
    try {
      const data = await listOrganizations()
      setOrganizations(data)
    } catch (error) {
      toast.error('조직 목록 로드 실패')
    }
  }

  const loadOrganizationDetail = async (id: number) => {
    try {
      const data = await getOrganization(id)
      setSelectedOrg(data)
    } catch (error) {
      toast.error('조직 상세 정보 로드 실패')
    }
  }

  const handleCreateOrganization = async () => {
    if (!newOrgName.trim()) {
      toast.error("조직 이름을 입력해주세요");
      return;
    }

    try {
      await createOrganization({ name: newOrgName, type: newOrgType });
      toast.success("조직이 생성되었습니다");
      setShowCreateModal(false);
      setNewOrgName("");
      setNewOrgType("company");
    } catch (error: any) {
      toast.error("조직 생성 실패", {
        description: error.response?.data?.detail || "오류가 발생했습니다",
      });
    }
  };

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <PageHeader
        title="조직 관리"
        description="조직을 생성하고 멤버를 관리하세요"
        backButton={{ label: "대시보드로", to: "/admin" }}
      />

      <div className="flex flex-1 overflow-hidden">
        <OrganizationList
          organizations={organizations}
          selectedOrg={selectedOrg}
          onSelect={loadOrganizationDetail}
          onOpenCreateModal={() => setShowCreateModal(true)}
        />

        <div className="flex-1 overflow-y-auto p-8"></div>
      </div>

      <CreateOrganizationModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateOrganization}
        newOrgName={newOrgName}
        setNewOrgName={setNewOrgName}
        newOrgType={newOrgType}
        setNewOrgType={setNewOrgType}
      />
    </div>
  );
};
