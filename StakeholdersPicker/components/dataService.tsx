// dataService.ts
import { mockStakeholders } from "../mockData/mockStakeholders";
import { mockRelationship } from "../mockData/mockRelationship";
import { IStakeholder } from "./types";

export class StakeholderDataService {
  // Flag to use mock data instead of real API calls
  private useMockData = true;
  private opportunityId_mock = "0010";

  constructor(private context: ComponentFramework.Context<any>) {}

  async loadAllStakeholders(searchText: string = ""): Promise<IStakeholder[]> {
    if (this.useMockData) {
      // Mock implementation
      const allStakeholdersResponse = {
        entities: mockStakeholders
      };

      return allStakeholdersResponse.entities.map(
        (entity) => ({
          stakeholderId: entity.cre97_stakeholderid,
          name: entity.cre97_name || "",
          email: entity.cre97_email || "",
          phone: entity.cre97_phone || "",
          role: entity.cre97_role || "",
          isSelected: false,
        })
      );
    } else {
      // Real implementation with API calls
      const allStakeholdersResponse = await this.context.webAPI.retrieveMultipleRecords(
        "cre97_stakeholder",
        "?$select=cre97_stakeholderid,cre97_name,cre97_email,cre97_phone,cre97_role&$filter=contains(cre97_name, '" + searchText + "')"
      );

      return allStakeholdersResponse.entities.map(
        (entity) => ({
          stakeholderId: entity.cre97_stakeholderid,
          name: entity.cre97_name || "",
          email: entity.cre97_email || "",
          phone: entity.cre97_phone || "",
          role: entity.cre97_role || "",
          isSelected: false,
        })
      );
    }
  }

  async loadLinkedStakeholders(opportunityId: string): Promise<IStakeholder[]> {
    if (this.useMockData) {
      // Mock implementation
      const linkedStakeholderIds = mockRelationship
        .filter(rel => rel.opportunityid === this.opportunityId_mock)
        .map(rel => rel.cre97_stakeholderid);
  
      const linkedData = mockStakeholders
        .filter(s => linkedStakeholderIds.includes(s.cre97_stakeholderid))
        .map(s => ({
          stakeholderId: s.cre97_stakeholderid,
          name: s.cre97_name,
          email: s.cre97_email,
          phone: s.cre97_phone,
          role: s.cre97_role,
          isSelected: false,
        }));
  
      return linkedData;
    } else {
      // Real implementation with API calls
      try {
        // Bước 1: Lấy tất cả các liên kết N:N giữa opportunity và stakeholder
        const relationshipResponse = await this.context.webAPI.retrieveMultipleRecords(
          "cre97_stakeholder_opportunity", // Tên thực thể liên kết N:N 
          `?$select=cre97_stakeholderid,opportunityid&$filter=opportunityid eq '${opportunityId}'`
        );
        
        // Lấy danh sách các ID stakeholder liên kết với opportunity này
        const stakeholderIds = relationshipResponse.entities.map(entity => entity.cre97_stakeholderid);
        
        if (stakeholderIds.length === 0) {
          return []; // Không có stakeholder liên kết
        }
        
        // Bước 2: Lấy thông tin chi tiết của từng stakeholder
        const linkedStakeholders: IStakeholder[] = [];
        
        for (const id of stakeholderIds) {
          try {
            // Lấy thông tin chi tiết của stakeholder qua ID
            const stakeholderResponse = await this.context.webAPI.retrieveRecord(
              "cre97_stakeholder", // Tên thực thể stakeholder
              id,
              "?$select=cre97_stakeholderid,cre97_name,cre97_email,cre97_phone,cre97_role"
            );
            
            // Thêm stakeholder vào danh sách kết quả
            linkedStakeholders.push({
              stakeholderId: stakeholderResponse.cre97_stakeholderid,
              name: stakeholderResponse.cre97_name || "",
              email: stakeholderResponse.cre97_email || "",
              phone: stakeholderResponse.cre97_phone || "",
              role: stakeholderResponse.cre97_role || "",
              isSelected: false
            });
          } catch (error) {
            console.error(`Error retrieving stakeholder with ID ${id}:`, error);
            // Tiếp tục với stakeholder tiếp theo nếu có lỗi
          }
        }
        
        return linkedStakeholders;
      } catch (error) {
        console.error("Error retrieving linked stakeholders:", error);
        return [];
      }
    }
  }

  async addStakeholderToOpportunity(opportunityId: string, stakeholder: IStakeholder): Promise<void> {
    if (this.useMockData) {
      // Add to mock relationship data
      mockRelationship.push({
        opportunityid: this.opportunityId_mock,
        cre97_stakeholderid: stakeholder.stakeholderId,
      });
    } else {
      // Create association between opportunity and stakeholder
      await this.context.webAPI.createRecord("cre97_stakeholder_opportunity", {
        opportunityid: { entityType: "opportunity", id: opportunityId },
        cre97_stakeholderid: {
          entityType: "contact",
          id: stakeholder.stakeholderId,
        },
      });
    }
  }

  async removeStakeholderFromOpportunity(opportunityId: string, stakeholder: IStakeholder): Promise<void> {
    if (this.useMockData) {
      // Remove from mock relationship data
      const index = mockRelationship.findIndex(
        (rel) =>
          rel.opportunityid === this.opportunityId_mock &&
          rel.cre97_stakeholderid === stakeholder.stakeholderId
      );
      if (index !== -1) {
        mockRelationship.splice(index, 1);
      }
    } else {
      // Delete the association record
      await this.context.webAPI.deleteRecord(
        "cre97_stakeholder_opportunity",
        `(opportunityid=${opportunityId},cre97_stakeholderid=${stakeholder.stakeholderId})`
      );
    }
  }
}