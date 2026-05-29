import { useCallback, useEffect, useRef, useState } from "react";

export function useUserMedia() {
  const [status, setStatus] = useState("idle"); // idle | running | error
  const [error, setError] = useState(null);
  const streamRef = useRef(null);

  const stop = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setStatus("idle");
  }, []);

  const start = useCallback(async () => {
    setError(null);
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("Seu navegador não suporta acesso à câmera.");
      }
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      streamRef.current = stream;
      setStatus("running");
      return stream;
    } catch (err) {
      const name = err?.name ?? "";
      if (name === "NotAllowedError" || name === "PermissionDeniedError") {
        setError("Permissão bloqueada. Abra as configurações do navegador e permita a câmera.");
      } else {
        setError("Erro ao acessar a câmera. Verifique se o dispositivo possui câmera disponível.");
      }
      setStatus("error");
      return null;
    }
  }, []);

  useEffect(() => stop, [stop]);

  return { status, error, start, stop, streamRef };
}

