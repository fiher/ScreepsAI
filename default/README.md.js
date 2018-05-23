All code is deprecated as of 6th of Martch 2018
New version is developed on a private server

Reasons
- The current version rellies on creeps calling their respective controllers
- Current version has no offensive or defensive logic that is fully automated
- Current version is not optimized for creeps to change their respective roles

Current workflow is creep-> logic -> data -> creep perform action
Desired workflow is roomManagement->Middleware (offensive defensive logic if active) -> Controllers -> management

To do this the new version will have the following structure
1. Sector which keeps information about rooms. Owned,allied,remote harvesting and enemy rooms
2. Each of `owned` rooms will have a type (new, old, surrounded etc.)
3. Each controller will have different `modes` for different rooms to manage them in different manner
4. Each controller will call all available creeps to do current job so it can assign them correctly
5. Spawning creeps will be on `queue` mode. Meaning that controllers will make calls to spawn queue

Sector->rooms->roomManagement->creeps->actions to be performed

TODO
1.Add Lab logic
2.Add more efficient remove harvesting logic
3.Add efficient Link logic
4.Improve defensive code