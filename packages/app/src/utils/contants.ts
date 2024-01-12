import { AppearanceType } from "@ditointernet/uai-components";

export const mappedStatus = {
    NOT_STARTED: { appearance: AppearanceType.WARNING, text: "Não iniciado" },
    VOTING_IN_PROGRESS: {
      appearance: AppearanceType.DRAFT,
      text: "Em progresso",
    },
    FINISHED: { appearance: AppearanceType.SUCCESS, text: "Finalizado" },
};