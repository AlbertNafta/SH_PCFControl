// dataService.ts
import { mockStakeholders } from "../mockData/mockStakeholders";
import { mockRelationship } from "../mockData/mockRelationship";
import { IStakeholder } from "./types";

export class StakeholderDataService {
  // Flag to use mock data instead of real API calls

  private useMockData = false;
  private opportunityId_mock = "0010";

  constructor(private context: ComponentFramework.Context<any>) { }

  async loadAllStakeholders(searchText: string = ""): Promise<IStakeholder[]> {
    console.log("StakeholderDataService");
    console.log(this.useMockData);
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
      const allStakeholdersResponse = await this.context.webAPI.retrieveMultipleRecords(
        "cre97_stakeholder",
        "?$select=cre97_stakeholderid,cre97_name,cre97_skateholdername,cre97_email,cre97_phone,cre97_role&$filter=contains(cre97_name, '" + searchText + "')"
      );
      try {
        //debugging
        const allStakeholdersResponse = await this.context.webAPI.retrieveRecord(
          "cre97_stakeholder",
          "?$select=cre97_stakeholderid,cre97_name,cre97_skateholdername,cre97_email,cre97_phone,cre97_role&$filter=contains(cre97_name, '" + searchText + "')"
        );
      } catch (error) {
        console.error("Error loading data:", error);

      }
      return allStakeholdersResponse.entities.map(
        (entity) => ({
          stakeholderId: entity.cre97_stakeholderid,
          name: entity.cre97_skateholdername || "",
          email: entity.cre97_email || "",
          phone: entity.cre97_phone || "",
          role: entity.cre97_role || "",
          isSelected: false,
        })
      );


    }
  }

  async loadLinkedStakeholders(opportunityId: string): Promise<IStakeholder[]> {
    console.log("linked: opport:", opportunityId);
    if (!opportunityId) {
      console.warn("No opportunity ID provided");
      return [];
    }
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
          "nhan_stakeholder_opportunity", // Tên thực thể liên kết N:N 
          `?$select=nhan_cre97_Stakeholder,nhan_Opportunity&$filter=_nhan_opportunity_value  eq '${opportunityId}'`
        );
          console.log("Response:", relationshipResponse);
        // Lấy danh sách các ID stakeholder liên kết với opportunity này
        const stakeholderIds = relationshipResponse.entities.map(entity => entity._nhan_cre97_stakeholder_value);
        console.log("stakeholderIds:", stakeholderIds);
        if (stakeholderIds.length === 0) {
          return []; // Không có stakeholder liên kết
        }

        // Bước 2: Lấy thông tin chi tiết của từng stakeholder
        const linkedStakeholders: IStakeholder[] = [];

        for (const id of stakeholderIds) {
          if (!id) {
            console.log("Skipping undefined stakeholder ID");
            continue; // Bỏ qua các ID không hợp lệ
          }
          try {
            // Lấy thông tin chi tiết của stakeholder qua ID
            const stakeholderResponse = await this.context.webAPI.retrieveRecord(
              "cre97_stakeholder", // Tên thực thể stakeholder
              id,
              "?$select=cre97_stakeholderid,cre97_name,cre97_skateholdername,cre97_email,cre97_phone,cre97_role"
            );
              console.log("stakeholderResponse:", stakeholderResponse);
            // Thêm stakeholder vào danh sách kết quả
            linkedStakeholders.push({
              stakeholderId: stakeholderResponse.cre97_stakeholderid,
              name: stakeholderResponse.cre97_skateholdername || "",
              email: stakeholderResponse.cre97_email || "",
              phone: stakeholderResponse.cre97_phone || "",
              role: stakeholderResponse.cre97_role || "",
              isSelected: false
            });
          } catch (error) {
            console.error(`Error retrieving stakeholder with ID ${id}:`, error);
            console.log(`Error retrieving stakeholder with ID ${id}:`, error);
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
      try {
        console.log("adding stakeholderrr");
        console.log(opportunityId, " ", stakeholder);
        
        // Create the intersection record with the correct lookup reference format
        await this.context.webAPI.createRecord("nhan_stakeholder_opportunity", {
          "nhan_Opportunity@odata.bind": `/opportunities(${opportunityId})`,
          "nhan_cre97_Stakeholder@odata.bind": `/cre97_stakeholders(${stakeholder.stakeholderId})`
        });
        
      } catch (error) {
        console.error("Error adding linked stakeholders add dataService:", error);
        throw error;
      }
    }
  }

  async removeStakeholderFromOpportunity(opportunityId: string, stakeholder: IStakeholder): Promise<void> {
    console.log("this.useMockData to del:", this.useMockData);
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
      try{
      // Delete the association record
      console.log("opportunityId to delete: ", opportunityId);
      console.log("stakeholder.stakeholderId to delete: ", stakeholder.stakeholderId);
      
      //First find the relationship record, then delete it by ID
      const relationshipRecords = await this.context.webAPI.retrieveMultipleRecords(
        "nhan_stakeholder_opportunity", // Tên thực thể liên kết N:N 
        `?$select=nhan_stakeholder_opportunityid,nhan_cre97_Stakeholder,nhan_Opportunity&$filter=_nhan_opportunity_value  eq '${opportunityId}'`
      );
      console.log("relationshipRecords to delete:",relationshipRecords);
      if (relationshipRecords.entities.length > 0) {
        // Get the primary key of the relationship record
        const relationshipId = relationshipRecords.entities[0].nhan_stakeholder_opportunityid;
        // Delete the record using its primary key
        console.log("relationshipId:",relationshipId);
        await this.context.webAPI.deleteRecord("nhan_stakeholder_opportunity", relationshipId);
        console.log("Relationship successfully deleted.");
      } else {
        console.log("No relationship record found to delete");
      }
      }catch (error) {
        console.error("Error delete stakeholder  :", error);
        console.log("Error delete stakeholder  :", error);
        // Tiếp tục với stakeholder tiếp theo nếu có lỗi
      }
    }
  }
}