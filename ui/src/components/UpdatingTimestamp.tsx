import React, { useEffect, useState } from "react";
import { formatDistanceToNowStrict } from "date-fns";

export function UpdatingTimestamp({date}: {date: Date}) {
  const [, forceStateUpdate] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      forceStateUpdate(i => i + 1);
    }, 5000);

    return () => {
      clearInterval(interval);
    }
  }, [])

  return <>{formatDistanceToNowStrict(date, {addSuffix: true})}</>
}
