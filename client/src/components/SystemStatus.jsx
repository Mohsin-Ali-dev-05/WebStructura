import { useEffect, useState } from "react";
import { getHealth } from "../services/healthService.js";

/**
 * Live API / database health for the Infrastructure card.
 * Never surfaces raw fetch errors (e.g. "Request failed with status 500").
 */
export default function SystemStatus() {
  const [apiStatus, setApiStatus] = useState("checking"); // checking | online | offline
  const [dbConnected, setDbConnected] = useState(false);
  const [dbName, setDbName] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function pingBackend() {
      try {
        const data = await getHealth();
        if (cancelled) {
          return;
        }

        const healthy =
          data?.success === true ||
          data?.data?.service === "server" ||
          Boolean(data?.data);

        if (!healthy) {
          setApiStatus("offline");
          setDbConnected(false);
          setDbName("");
          return;
        }

        setApiStatus("online");
        const state = data?.data?.database?.state;
        setDbConnected(state === "connected");
        setDbName(
          typeof data?.data?.database?.name === "string"
            ? data.data.database.name
            : "",
        );
      } catch {
        if (!cancelled) {
          setApiStatus("offline");
          setDbConnected(false);
          setDbName("");
        }
      }
    }

    pingBackend();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="system-status" aria-live="polite">
      {apiStatus === "checking" ? (
        <p className="status-card-message text-sm text-gray-500 py-3">
          Checking API…
        </p>
      ) : null}

      {apiStatus !== "checking" ? (
        <div
          className="flex justify-between items-center py-3 border-t border-gray-100"
          role="status"
        >
          <span className="text-sm font-medium text-gray-700">API Service</span>
          {apiStatus === "online" ? (
            <span className="inline-flex items-center gap-2 text-emerald-700 font-medium text-sm">
              <span
                className="bg-emerald-500 animate-pulse rounded-full h-2 w-2"
                aria-hidden="true"
              />
              Operational
            </span>
          ) : (
            <span className="inline-flex items-center gap-2 text-rose-700 font-medium text-sm">
              <span
                className="bg-rose-500 rounded-full h-2 w-2"
                aria-hidden="true"
              />
              Offline
            </span>
          )}
        </div>
      ) : null}

      {apiStatus === "online" ? (
        <>
          <div className="flex justify-between items-center py-3 border-t border-gray-100">
            <span className="text-sm font-medium text-gray-700">Database</span>
            {dbConnected ? (
              <span className="inline-flex items-center gap-2 text-emerald-700 font-medium text-sm">
                <span
                  className="bg-emerald-500 animate-pulse rounded-full h-2 w-2"
                  aria-hidden="true"
                />
                Connected
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 text-rose-700 font-medium text-sm">
                <span
                  className="bg-rose-500 rounded-full h-2 w-2"
                  aria-hidden="true"
                />
                Unavailable
              </span>
            )}
          </div>

          {dbName ? (
            <div className="flex justify-between items-center py-3 border-t border-gray-100">
              <span className="text-sm font-medium text-gray-700">
                Database name
              </span>
              <span className="text-sm font-mono">{dbName}</span>
            </div>
          ) : null}
        </>
      ) : null}

      {apiStatus === "offline" ? (
        <p className="text-xs text-gray-500 pt-1 pb-1">
          Start the Express API on port 5000 to restore service checks.
        </p>
      ) : null}
    </div>
  );
}
