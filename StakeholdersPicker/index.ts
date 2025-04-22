// index.ts - Main PCF Control file
import { IInputs, IOutputs } from "./generated/ManifestTypes";
import * as React from "react";
import * as ReactDOM from "react-dom";
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
        ReactDOM.render(
            React.createElement(StakeholderManagement, {
                context: this.context,
                opportunityId: this.opportunityId,
                notifyOutputChanged: this.notifyOutputChanged,
            }),
            this.container
        );
    }

    public getOutputs(): IOutputs {
        return {};
    }

    public destroy(): void {
        ReactDOM.unmountComponentAtNode(this.container);
    }
}
