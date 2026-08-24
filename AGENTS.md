## Feature

When creating a UI element uses Angular Material elements don't generate tests.

### Folder structure

- `data-access` NgRx Signal Store for POST, PATCH and PUT request use HttpResource API for GET requesta.
- `features` for different displays.
- `interfaces` for types, starting with `I`, for example `ISignInPayload`. No type should be defined directly in components or services use barrel export.
- `ui` for visual elements with no direct interaction with the store
