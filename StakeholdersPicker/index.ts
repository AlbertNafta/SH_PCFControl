// index.ts - Main PCF Control file
import { IInputs, IOutputs } from "./generated/ManifestTypes";
import * as React from "react";
import * as ReactDOM from "react-dom/client";   
import { StakeholderManagement } from "./StakeholderManagement";

// index.ts
export * from "./StakeholderManagement";
export * from "./components/types";
export * from "./components/dataService";
export * from "./components/stakeholderOperations";
export * from "./components/SimplePagination";
export * from "./components/StakeholderUI";
export * from "./components/columnConfig";
export class StakeholderManagementControl
    implements ComponentFramework.StandardControl<IInputs, IOutputs>
{
    private container: HTMLDivElement;
    private notifyOutputChanged: () => void;
    private context: ComponentFramework.Context<IInputs>;
    private opportunityId: string;
    private opportunityId_fake: string;
    private root: ReactDOM.Root | null = null;

    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary,
        container: HTMLDivElement
    ): void {
        this.container = container;
        this.notifyOutputChanged = notifyOutputChanged;
        this.context = context;

        // Get the opportunity ID from the current record context
        const formContext = (context as any).page;
        console.log(" this.container ", this.container )
        if (formContext && formContext.entityId) {
            this.opportunityId = formContext.entityId;
        } else {
            // Fallback to empty string or a default value
            this.opportunityId = "";
            console.error("Could not determine opportunityId from context");
        }

        this.renderControl();
    }

    public updateView(context: ComponentFramework.Context<IInputs>): void {
        this.context = context;
        this.renderControl();
    }

    private renderControl(): void {
        console.log("Rendercontrol");
        
        // React 18 way: Create root once if it doesn't exist
        if (!this.root) {
            this.root = ReactDOM.createRoot(this.container);
        }
        console.log("opprtunityID:",this.opportunityId)
        // React 18 way: Use root.render instead of ReactDOM.render
        this.root.render(
            React.createElement(StakeholderManagement, {
                context: this.context,
                opportunityId: this.opportunityId,
                opportunityId_fake: this.opportunityId_fake,
                notifyOutputChanged: this.notifyOutputChanged,
            })
        );
    }

    public getOutputs(): IOutputs {
        return {};
    }

    public destroy(): void {
        // React 18 way: Unmount using root.unmount()
        if (this.root) {
            this.root.unmount();
            this.root = null;
        }
    }
}