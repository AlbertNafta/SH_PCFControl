# SH_PCFControl
### By Le Nhan n' Le Gia Phu
""# PCF React Deep Dive

## Requirement:

* On the **Opportunity** form, a **PCF Control** will be used to manage **Stakeholders**.

## Features:

* **Multi-select capability** with:

  * Checkboxes or tags.
* **Search functionality**:

  * Typeahead or dropdown filtering.
* **Navigation support**:

  * Paging or scrolling.

## Technical Details:

* **Fluent UI** will be used for a consistent look and feel.
* The control will:

  * Load existing relationships via **Web API**.
  * Allow users to **add new Stakeholders**.
  * Allow removing **selected Stakeholders**.

## Backend Synchronization:

* If required, trigger:

  * A **plugin** or use **Dataverse Web API** to maintain the **N\:N relationships**.
    ""

## Key Resources:

* [PCF React](https://chatgpt.com/c/68030aeb-9dac-8010-b926-7ad8d661ac84)
* [PCF React Share](https://chatgpt.com/share/6805b697-5048-8010-9195-e4b6887b6604)
* [Microsoft WebAPI Reference](https://learn.microsoft.com/en-us/power-apps/developer/component-framework/reference/webapi)
* [Building a PCF Control with Context WebAPI](https://carldesouza.com/building-a-pcf-control-that-calls-context-webapi/)
* [Supported Functions in WebAPI](https://learn.microsoft.com/en-us/power-apps/developer/component-framework/reference/webapi)


---
---

## PCF Types:

1. **Standard**
2. **Virtual React**
3. **Hybrid**

   * The infrastructure is not React but contains React components.
   * You can convert a **Standard** PCF to a **Virtual** one.

### Examples:

* [Hybrid PCF Example](https://youtu.be/B0mpPRazGw0?si=Vp9u_dBxE8CSDFXg)
* [React Standard Type](https://youtu.be/R1hTz-T5feQ?si=7nQdJ0Wjq9S9IgW_&t=1321)
* [YouTube Playlist for PCF](https://youtube.com/playlist?list=PLwhleHnDZ_IbjjHW_LaUMtmRYLmS74viU&si=Bbmr2NHY-ovPAiTi)

---

## Common Issues:

1. **Project Name with Spaces:**

   * Spaces in project names create `%20`, causing build and deploy failures.
   * Solution: Replace `%20` with the original name.

2. **.Net 4.6 Developer Pack Required:**

   * Sometimes necessary for compiling PCF.

3. **No Cache Found Error:**

   * Issue: PCF wouldn't compile without any changes.
   * Solution: Delete the PCF component → Remove it → Refresh → Rebuild → Deploy.

---

## Key React Concepts:

* `useEffect`: Runs once on the first render and when dependencies change.
* `useMemo`: Manages and recalculates values for state changes.
* **Array Dependencies:** Triggers functions when values change or can be bypassed with `select` or `onClick`.

### Reference:

* [React Key Concepts](https://chatgpt.com/c/680a0ab7-7140-8010-92bb-ba5501a15343)

---

## Fetching Data:

* Use this for:

  * Getting contacts associated with a given account GUID.
  * Getting contacts associated with other accounts but not linked to the given account GUID.
  * Getting contacts not associated with the given account GUID (includes unlinked and linked to others).

### Reference:

* [Fetching Contacts via Intersect Table](https://chatgpt.com/c/6809b0d2-3184-8010-996f-2f5d06de983e)

---

## Hidden PCF Properties:

* Some PCF properties do not exist in the official docs but are visible in forums or by logging the `context` property.

  * [Example 1](https://community.dynamics.com/blogs/post/?postid=dbae3ca3-fc59-4235-b38f-d60961f17c70)
  * [Example 2](https://community.powerplatform.com/forums/thread/details/?threadid=75190d9d-c96a-4359-b82d-8bcfb2f38828)

---

## Custom Action Trigger:

* PCF **cannot** trigger a Custom Action directly.
* It **can** call a **Power Automate** flow instead.
* [Dataverse Custom API Call Snippet](https://rajeevpentyala.com/2024/12/18/code-snippet-pcf-calling-dataverse-custom-api/)

---

## WebAPI Functions:

* Anything that works client-side also works in PCF; simply replace `Xrm` with `context`.
* Ignore the warnings and errors.
* [Dataverse Custom API Call](https://rajeevpentyala.com/2024/12/18/code-snippet-pcf-calling-dataverse-custom-api/)
* `Xrm.WebAPI` → `context.WebAPI` in PCF.

---

## Dataverse REST Builder & PCF:

* Originally used to build JS scripts for calling Custom Actions.
* DRB used `Xrm.WebAPI.execute()` which works due to backward compatibility, but the correct call is `Xrm.WebAPI.online.execute()`.
* [Dataverse REST Builder](https://chatgpt.com/share/681c671b-9964-8010-b258-34209e25adaf)

---

## Version Management:

* PCF version needs to be updated before deploying to managed environments.
* If the PCF is not updated in the target environment, check the version.
* [Update PCF Version](https://dianabirkelbach.wordpress.com/2020/12/23/all-about-pcf-versioning)
* [Versioning Guide](https://chatgpt.com/share/681c87f0-5c08-8010-a64f-55860fa815ba)
  ""
