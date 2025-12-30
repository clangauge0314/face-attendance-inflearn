import { useState } from "react";
import { toast } from "sonner";
import { createOrganization } from "../api/organization";
import { PageHeader } from "../components/common/page-header";
import { CreateOrganizationModal } from "../components/admin/organization /create-organization-modal";

export const OrganizationManagementPage = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newOrgName, setNewOrgName] = useState("");
  const [newOrgType, setNewOrgType] = useState("company");

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

      <div className="flex flex-1 items-center justify-center overflow-hidden">
        <button
          onClick={() => setShowCreateModal(true)}
          className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
        >
          조직 생성하기
        </button>
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
