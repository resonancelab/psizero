# User Discovery Mechanism Analysis

## Current Implementation

The user discovery mechanism in `quantum-comm-cli.cjs` works through telemetry monitoring:

### Discovery Process
1. **Telemetry Monitoring** (`startTelemetryMonitoring`):
   - Sets 3-second interval calling `discoverUsersFromDeltas()`
   - Updates local space state from snapshots

2. **User Discovery** (`discoverUsersFromDeltas`):
   - Fetches space stats: `GET /v1/spaces/{spaceId}/stats`
   - Parses `stats.current_telemetry.sessions` array
   - For each session (excluding own):
     - Extracts `userId` from `session.memberId || session.userId || 'user_${session.id}'`
     - Extracts `userName` from `session.displayName || 'Peer_${session.id.substr(0, 6)}'`
     - Creates `discoveredUser` with quantum properties
     - Stores in `this.discoveredUsers` Map

### Root Cause Analysis

**Problem**: Users connect to different spaces despite identical `SPACE_NAME`

**Evidence from logs**:
- Run 1: Created `space_9119f097-ae65-46ce-b756-5dfa8bc9f8f1`
- Run 2: Joined `space_33eb2885-b611-4026-a029-55613800d44a`

**Space Search Logic Issue**:
```javascript
const existingSpace = spaces.items?.find(s =>
  s.config?.name === SPACE_NAME || s.name === SPACE_NAME
);
```

This finds the **first** space matching the name, but multiple spaces can exist with the same name. The API returns spaces in arbitrary order, causing different clients to join different spaces.

## Proposed Solutions

### Option 1: Deterministic Space Selection
- Sort spaces by creation timestamp
- Always join the oldest space with matching name
- Ensures all users converge to the same space

### Option 2: Fixed Space ID
- Generate deterministic space ID from `SPACE_NAME`
- Use `crypto.createHash('sha256').update(SPACE_NAME).digest('hex')` as space ID
- Eliminates name-based search entirely

### Option 3: Enhanced Search Logic
- Match exact config properties, not just name
- Prioritize spaces with active sessions
- Fallback to creation if no suitable space found

## Implementation Plan

1. **Modify Space Search** in `connectToNetwork()`:
   - Sort spaces by `createdAt` or `epoch`
   - Select the oldest matching space
   - Add fallback for space creation

2. **Add Space Validation**:
   - Verify space config matches expected parameters
   - Ensure space has correct quantum settings

3. **Improve Error Handling**:
   - Better logging for space selection decisions
   - Handle cases where no suitable space exists

## Testing Strategy

- Run multiple CLI instances simultaneously
- Verify all users appear in each other's discovery lists
- Test space convergence when starting instances at different times
- Validate that users remain discoverable after reconnects

## Expected Outcome

All users will consistently join the same space and discover each other through the telemetry mechanism, enabling proper quantum communication and entanglement.