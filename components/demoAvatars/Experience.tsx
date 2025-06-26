import {CameraControls, ContactShadows, Environment, Text,} from "@react-three/drei";
import {Suspense, useEffect, useRef, useState} from "react";
import {useAvatar} from "@/hooks/useAvatar.tsx";
import {FemaleAvatar} from "./FemaleAvatar";
import {MaleAvatar} from "./MaleAvatar";

const Dots = ({position}: { position: [number, number, number] }) => {
    const {loading} = useAvatar();
    const [loadingText, setLoadingText] = useState("");

    useEffect(() => {
        if (loading) {
            const interval = setInterval(() => {
                setLoadingText((loadingText) => {
                    if (loadingText.length > 2) {
                        return ".";
                    }
                    return loadingText + ".";
                });
            }, 800);
            return () => clearInterval(interval);
        } else {
            setLoadingText("");
        }
    }, [loading]);

    if (!loading) return null;

    return (
        <group position={position}>
            <Text fontSize={0.14} anchorX={"left"} anchorY={"bottom"}>
                {loadingText}
                <meshBasicMaterial attach="material" color="red"/>
            </Text>
        </group>
    );
};

export const Experience = ({gender}: { gender: "male" | "female" }) => {
    const cameraControls = useRef<CameraControls | null>(null);

    useEffect(() => {
        if (cameraControls.current) {
            cameraControls.current.setLookAt(0, 2, 5, 0, 1.5, 0);
        }
    }, []);

    return (
        <>
            <CameraControls ref={cameraControls}/>
            <Environment preset="sunset"/>
            <Suspense>
                <Dots position={[0, 1.75, 0]}/>
            </Suspense>
            {gender === "female" ? <Suspense fallback={<div>Loading 3D model...</div>}>
                <FemaleAvatar/>
            </Suspense> : <MaleAvatar/>}
            <ContactShadows opacity={0.7}/>
        </>
    );
};