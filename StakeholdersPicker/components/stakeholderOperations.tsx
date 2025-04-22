// stakeholderOperations.ts
import { Selection } from "@fluentui/react/lib/DetailsList";
import { IStakeholder } from "./types";
import { StakeholderDataService } from "./dataService";

export class StakeholderOperations {
  constructor(
    private dataService: StakeholderDataService,
    private opportunityId: string,
    private setIsLoading: (loading: boolean) => void,
    private setError: (error: string | null) => void,
    private notifyOutputChanged: () => void
  ) {}

  async addStakeholderToOpportunity(
    stakeholder: IStakeholder,
    linkedStakeholders: IStakeholder[],
    setLinkedStakeholders: React.Dispatch<React.SetStateAction<IStakeholder[]>>
  ): Promise<void> {
    try {
      // Check if stakeholder is already linked
      if (
        linkedStakeholders.some(
          (s) => s.stakeholderId === stakeholder.stakeholderId
        )
      ) {
        this.setError("This stakeholder is already linked to this opportunity.");
        return;
      }

      this.setIsLoading(true);

      // Create association between opportunity and stakeholder
      await this.dataService.addStakeholderToOpportunity(this.opportunityId, stakeholder);

      // Update state to include the newly linked stakeholder
      setLinkedStakeholders([
        ...linkedStakeholders,
        { ...stakeholder, isSelected: false },
      ]);
      this.setError(null);
      this.notifyOutputChanged();
    } catch (error) {
      console.error("Error adding stakeholder:", error);
      this.setError("Failed to add stakeholder. Please try again.");
    } finally {
      this.setIsLoading(false);
    }
  }

  async linkSelectedStakeholders(
    selection: Selection,
    linkedStakeholders: IStakeholder[],
    setLinkedStakeholders: React.Dispatch<React.SetStateAction<IStakeholder[]>>
  ): Promise<void> {
    try {
      console.log("Add stakeholder is clicked");
      const selectedToAdd = selection.getSelection() as IStakeholder[];
      console.log(selectedToAdd);
      if (selectedToAdd.length === 0) return;

      this.setIsLoading(true);

      const newLinked = selectedToAdd.map(s => ({
        ...s,
        isSelected: false,
      }));
      console.log("Add stakeholder is clicked 2");

      // Process each stakeholder
      for (const stakeholder of selectedToAdd) {
        await this.dataService.addStakeholderToOpportunity(this.opportunityId, stakeholder);
      }

      // Add to linked UI with proper type for the updater function
      setLinkedStakeholders(prev => [...prev, ...newLinked]);
      this.setError(null);
      this.notifyOutputChanged();
    } catch (err) {
      console.error("Failed to link selected stakeholders", err);
      this.setError("Failed to link selected stakeholders. Try again.");
    } finally {
      this.setIsLoading(false);
    }
  }

  async removeSelectedStakeholders(
    selection: Selection,
    linkedStakeholders: IStakeholder[],
    setLinkedStakeholders: React.Dispatch<React.SetStateAction<IStakeholder[]>>
  ): Promise<void> {
    try {
      const selected = selection.getSelection() as IStakeholder[];

      if (selected.length === 0) {
        this.setError("Please select at least one stakeholder to remove.");
        return;
      }

      this.setIsLoading(true);

      // Remove each selected stakeholder
      for (const stakeholder of selected) {
        await this.dataService.removeStakeholderFromOpportunity(this.opportunityId, stakeholder);
      }

      // Update linked list in state
      const updated = linkedStakeholders.filter(
        (s) => !selected.some(sel => sel.stakeholderId === s.stakeholderId)
      );

      setLinkedStakeholders(updated);
      this.setError(null);
      this.notifyOutputChanged();
    } catch (error) {
      console.error("Error removing stakeholders:", error);
      this.setError("Failed to remove stakeholders. Please try again.");
    } finally {
      this.setIsLoading(false);
    }
  }
}