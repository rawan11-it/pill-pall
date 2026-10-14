# Pill Pal Security Specification (Phase 0: TDD)

## 1. Core Data Invariants

1. **Tenant Ownership**: Every record (`UserProfile`, `ChildProfile`, `Medication`, `DoseLog`) is nested under `/users/{userId}` where `{userId}` must strictly equal `request.auth.uid`. Cross-user data access is forbidden by default.
2. **Relational Integrity**:
   - A `ChildProfile` must have `userId == request.auth.uid`.
   - A `Medication` must reference a valid `childId` and `userId == request.auth.uid`.
   - A `DoseLog` must reference a valid `medicationId`, `childId`, and `userId == request.auth.uid`.
3. **Immutability Invariant**:
   - `id`, `userId`, and `createdAt` are immutable once written.
   - For `Medication`, `childId` is immutable.
   - For `DoseLog`, past log records cannot be rewritten to spoof timestamps.
4. **Volumetric Boundaries**:
   - All string fields have explicit `.size() <= MAX` bounds to eliminate denial-of-wallet payload attacks.
   - Document IDs must match regex `^[a-zA-Z0-9_\-]+$` and length `<= 128`.
5. **Verified Auth**:
   - All write operations require an authenticated user with `request.auth.uid != null`.

---

## 2. The "Dirty Dozen" Threat Payloads (Must Return PERMISSION_DENIED)

1. **DD-01: Anonymous Unauthenticated Read**
   - Attempt: Unauthenticated read on `/users/user123/children/child1`.
   - Expected: `PERMISSION_DENIED`
2. **DD-02: Cross-Tenant Child Access**
   - Attempt: User `attacker-456` reads `/users/victim-123/children/child1`.
   - Expected: `PERMISSION_DENIED`
3. **DD-03: Cross-Tenant Medication Hijacking**
   - Attempt: User `attacker-456` writes or updates `/users/victim-123/medications/med1`.
   - Expected: `PERMISSION_DENIED`
4. **DD-04: Shadow Field Injection**
   - Attempt: Creating a `UserProfile` with unrecognized administrative fields (`isAdmin: true`, `role: "superadmin"`).
   - Expected: `PERMISSION_DENIED` via `hasOnly()` key gate.
5. **DD-05: Denial-of-Wallet Payload (Giant String Bomb)**
   - Attempt: Creating a medication with a 2MB name string.
   - Expected: `PERMISSION_DENIED` via `data.name.size() <= 100`.
6. **DD-06: Document ID Path Traversal / Poisoning**
   - Attempt: Writing document at `/users/user123/children/../../../etc/passwd` or ID with illegal characters.
   - Expected: `PERMISSION_DENIED` via `isValidId(childId)`.
7. **DD-07: Relational Spoofing (Foreign Child ID)**
   - Attempt: User creates a medication with `userId: "attacker-456"` under `/users/victim-123/medications/med1`.
   - Expected: `PERMISSION_DENIED`
8. **DD-08: Tampering with Immutable Creation Timestamps**
   - Attempt: Updating `createdAt` to a backdated timestamp.
   - Expected: `PERMISSION_DENIED` via `incoming().createdAt == existing().createdAt`.
9. **DD-09: Invalid Enumeration Value**
   - Attempt: Setting `Medication.status` to `"invalid_state"`.
   - Expected: `PERMISSION_DENIED` via enum validation.
10. **DD-10: Unauthorized Dose Log Deletion**
    - Attempt: Non-owner attempts to wipe dose audit log records.
    - Expected: `PERMISSION_DENIED`
11. **DD-11: Arbitrary List Scraping**
    - Attempt: Client submits an unbounded query attempting to list all medications in the entire database.
    - Expected: `PERMISSION_DENIED` (Global deny-all rule blocks root queries).
12. **DD-12: Type Confusion Injection**
    - Attempt: Sending `inventoryDoses: "fifty"` (string instead of integer/number).
    - Expected: `PERMISSION_DENIED` via `incoming().inventoryDoses is number`.
