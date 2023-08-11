type Virksomhet = { orgnr: string };
export const sendteMetrikker: Virksomhet[] = [];

interface Metrikk {
  orgnr: string;
  type: MetrikkType;
  kilde: MetrikkKilde;
}

export enum MetrikkType {
  DIGITAL_IA_TJENESTE = "DIGITAL_IA_TJENESTE",
  INFORMASJONSTJENESTE = "INFORMASJONSTJENESTE",
  INTERAKSJONSTJENESTE = "INTERAKSJONSTJENESTE",
  RÅDGIVNING = "RÅDGIVNING",
}

export enum MetrikkKilde {
  SYKEFRAVÆRSSTATISTIKK = "SYKEFRAVÆRSSTATISTIKK",
  SAMTALESTØTTE = "SAMTALESTØTTE",
  FOREBYGGE_FRAVÆR = "FOREBYGGE_FRAVÆR",
  KALKULATOR = "KALKULATOR",
  NETTKURS = "NETTKURS",
  DIALOG = "DIALOG",
  FOREBYGGINGSPLAN = "FOREBYGGINGSPLAN",
}

export const sendIaMetrikk = async (
  orgnr: string,
  metrikkType: MetrikkType,
  metrikkKilde: MetrikkKilde,
  url: string
): Promise<Virksomhet[]> => {
  const metrikk: Metrikk = {
    orgnr: orgnr,
    type: metrikkType,
    kilde: metrikkKilde,
  };
  if (!erIaMetrikkSendtForBedrift(orgnr)) {
    const fetchResponse = await fetch(`${url}`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(metrikk),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const data = await fetchResponse.json();
    if (data.status === "created") {
      sendteMetrikker.push({ orgnr: orgnr });
    }
  }
  return Promise.resolve(sendteMetrikker);
};

export const erIaMetrikkSendtForBedrift = (orgnr: string): boolean => {
  return sendteMetrikker.some((virksomhet) => virksomhet.orgnr === orgnr);
};

export const iaMetrikkerApiPath = `/ia-tjenester-metrikker/innlogget/mottatt-iatjeneste`;
export const getIaMetrikkerApiUrl = (basePath: string): string => {
  return `${basePath}${iaMetrikkerApiPath}`;
};
