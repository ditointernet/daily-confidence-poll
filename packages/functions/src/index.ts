import { initializeApp } from "firebase-admin/app";

import onUserVoteCreated from "./onUserVoteCreated";
import onFirebaseAuthUserCreated from "./onFirebaseAuthUserCreated";

initializeApp();

export { onFirebaseAuthUserCreated, onUserVoteCreated };
