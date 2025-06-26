"use client";
import React, {useRef, useState} from "react";
import {AvatarProvider} from "@/hooks/useAvatar";
import {Leva} from "leva";
import {UI} from "@/components/demoAvatars/UI.tsx";
import {NewsRibbon} from "@/components/demoAvatars/NewsRibbon.tsx";
import {Canvas} from "@react-three/fiber";
import {Loader} from "@react-three/drei";
import {Experience} from "@/components/demoAvatars/Experience.tsx";

export default function DemoAvatar() {
    const [gender, setGender] = useState<"female" | "male">("female");
    const mountRef = useRef<HTMLDivElement>(null);

    return (
        <>
            <AvatarProvider>
                <Loader/>
                <Leva hidden/>
                <div
                    className="h-full w-full relative rounded-lg overflow-hidden"
                    style={{
                        backgroundImage: "url('/background.png')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                >
                    <UI gender={gender} setGender={setGender} hidden={false}/>
                    <Canvas shadows camera={{position: [0, 0, 0], fov: 10}} className="h-full w-full">
                        <Experience gender={gender}/>
                    </Canvas>
                    <NewsRibbon/>
                </div>
            </AvatarProvider>
        </>
    );
}
