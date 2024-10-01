"use client";
import { useEffect, useState } from "react";

export default function TTS() {
  useEffect(() => {
    getTTS();
  }, []);

  async function getTTS() {
    const audioRes = await fetch(`/api/azure-tts?teacher=Nanami&text=Hello`);
    const audio = await audioRes.blob();
    const visemes = JSON.parse(await audioRes.headers.get("visemes"));
    const audioUrl = URL.createObjectURL(audio);
    const audioPlayer = new Audio(audioUrl);
    console.log(visemes, audioUrl);
  }

  return <div></div>;
}
