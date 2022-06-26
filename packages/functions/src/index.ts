import { initializeApp } from "firebase-admin/app";

initializeApp();

import onUserVoteCreated from "./onUserVoteCreated";
import onFirebaseAuthUserCreated from "./onFirebaseAuthUserCreated";

export { onFirebaseAuthUserCreated, onUserVoteCreated };
