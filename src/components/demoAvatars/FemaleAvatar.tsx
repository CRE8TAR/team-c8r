import React, {useEffect, useRef, useState} from "react";
import {useAnimations, useGLTF} from "@react-three/drei";
import {EventHandlers, InstanceProps, MathProps, ReactProps, useFrame,} from "@react-three/fiber";
import * as THREE from "three";
import {button, useControls} from "leva";
import {Mutable, Overwrite,} from "@react-three/fiber/dist/declarations/src/core/utils";
import {useAvatar} from "@/hooks/useAvatar";

// Facial expression presets
const facialExpressions = {
    default: {},
    neutral: {
        browInnerUp: 0.17,
        eyeSquintLeft: 0.4,
        eyeSquintRight: 0.44,
        noseSneerLeft: 0.17,
        noseSneerRight: 0.14,
        mouthPressLeft: 0.61,
        mouthPressRight: 0.41,
        mouthSmileLeft: 0.1,
        mouthSmileRight: 0.1,
    },
    smile: {
        browInnerUp: 0.17,
        eyeSquintLeft: 0.4,
        eyeSquintRight: 0.44,
        noseSneerLeft: 0.17,
        noseSneerRight: 0.14,
        mouthPressLeft: 0.61,
        mouthPressRight: 0.41,
        mouthSmileLeft: 0.2,
        mouthSmileRight: 0.2,
    },
};

// Viseme mapping for lip sync
const corresponding = {
    A: "viseme_PP",
    B: "viseme_kk",
    C: "viseme_I",
    D: "viseme_AA",
    E: "viseme_O",
    F: "viseme_U",
    G: "viseme_FF",
    H: "viseme_TH",
    X: "viseme_PP",
};

let setupMode = false;

export function FemaleAvatar(
    props: React.JSX.IntrinsicAttributes &
        Mutable<
            Overwrite<
                Partial<
                    Overwrite<
                        THREE.Group<THREE.Object3DEventMap>,
                        MathProps<THREE.Group<THREE.Object3DEventMap>> &
                        ReactProps<THREE.Group<THREE.Object3DEventMap>> &
                        Partial<EventHandlers>
                    >
                >,
                Omit<
                    InstanceProps<
                        THREE.Group<THREE.Object3DEventMap>,
                        typeof THREE.Group
                    >,
                    "object"
                >
            >
        >
) {
    const {nodes, materials, animations, scene} = useGLTF("models/Female.glb");
    const {message, audioRef} = useAvatar()

    interface Lipsync {
        mouthCues: {
            start: number;
            end: number;
            value: keyof typeof corresponding;
        }[];
    }

    const [lipsync, setLipsync] = useState<Lipsync | undefined>();
    const group = useRef<THREE.Group>(null);
    const {actions} = useAnimations(animations, group);

    // State management
    const [animation, setAnimation] = useState(
        animations.find((a) => a.name === "Idle") ? "Idle" : animations[0].name
    );
    const [blink, setBlink] = useState(false);
    const [winkLeft, setWinkLeft] = useState(false);
    const [winkRight, setWinkRight] = useState(false);
    const [facialExpression, setFacialExpression] =
        useState<keyof typeof facialExpressions>("neutral");

    useEffect(() => {
        if (!message) {
            if (actions["Idle"] && animation !== "Idle") {
                actions["Idle"].reset().fadeIn(0.5).play();
                setAnimation("Idle");
            }
            return;
        }

        if (message.animation && message.animation !== animation) {
            if (actions[animation]) {
                actions[animation].fadeOut(0.5);
            }
            setAnimation(message.animation);
        }

        setFacialExpression(message.facialExpression || "neutral");
        setLipsync(message.lipsync);
    }, [message, actions, animation]);

    useEffect(() => {
        if (!actions[animation]) return;

        const action = actions[animation].reset().fadeIn(0.5);
        if (animation === "Idle") {
            action.setLoop(THREE.LoopRepeat, Infinity);
        }
        action.play();

        return () => {
            if (actions[animation]) {
                actions[animation].fadeOut(0.5);
            }
        };
    }, [animation, actions]);

    const lerpMorphTarget = (target: string, value: number, speed = 0.1) => {
        scene.traverse((child) => {
            if (child instanceof THREE.SkinnedMesh && child.morphTargetDictionary) {
                const index = child.morphTargetDictionary[target];
                if (
                    index === undefined ||
                    child.morphTargetInfluences?.[index] === undefined
                ) {
                    return;
                }
                child.morphTargetInfluences[index] = THREE.MathUtils.lerp(
                    child.morphTargetInfluences[index],
                    value,
                    speed
                );

                if (!setupMode) {
                    try {
                        set({
                            [target]: value,
                        });
                    } catch (e) {
                        console.log("Error setting morph target value:", e);
                    }
                }
            }
        });
    };

    useFrame(() => {
        // Handle facial expressions
        if (!setupMode) {
            Object.keys(
                (nodes.EyeLeft as THREE.SkinnedMesh).morphTargetDictionary || {}
            ).forEach((key) => {
                const mapping = facialExpressions[facialExpression];
                if (key === "eyeBlinkLeft" || key === "eyeBlinkRight") {
                    return; // eyes wink/blink are handled separately
                }
                if (mapping && (mapping as Record<string, number>)[key]) {
                    if (mapping && typeof mapping === "object" && key in mapping) {
                        lerpMorphTarget(key, (mapping as Record<string, number>)[key], 0.1);
                    }
                } else {
                    lerpMorphTarget(key, 0, 0.1);
                }
            });
        }

        // Handle blinking
        lerpMorphTarget("eyeBlinkLeft", blink || winkLeft ? 1 : 0, 0.5);
        lerpMorphTarget("eyeBlinkRight", blink || winkRight ? 1 : 0, 0.5);

        // Handle lipsync
        if (setupMode) return;

        const appliedMorphTargets: string[] = [];
        if (message && lipsync && audioRef.current && !audioRef.current.paused) {
            const currentAudioTime = audioRef.current.currentTime;
            for (let i = 0; i < lipsync.mouthCues.length; i++) {
                const mouthCue = lipsync.mouthCues[i];
                if (
                    currentAudioTime >= mouthCue.start &&
                    currentAudioTime <= mouthCue.end
                ) {
                    const visemeKey = corresponding[mouthCue.value];
                    if (visemeKey) {
                        appliedMorphTargets.push(visemeKey);
                        lerpMorphTarget(visemeKey, 1, 0.2);
                    }
                    break;
                }
            }
        }

        // Reset unused visemes
        Object.values(corresponding).forEach((value) => {
            if (appliedMorphTargets.includes(value)) return;
            lerpMorphTarget(value, 0, 0.1);
        });
    });

    // Animation controls
    useControls("FacialExpressions", {
        winkLeft: button(() => {
            setWinkLeft(true);
            setTimeout(() => setWinkLeft(false), 300);
        }),
        winkRight: button(() => {
            setWinkRight(true);
            setTimeout(() => setWinkRight(false), 300);
        }),
        animation: {
            value: animation,
            options: animations.map((a) => a.name),
            onChange: (value) => setAnimation(value),
        },
        facialExpression: {
            options: Object.keys(facialExpressions),
            onChange: (value) => setFacialExpression(value),
        },
        enableSetupMode: button(() => {
            setupMode = true;
        }),
        disableSetupMode: button(() => {
            setupMode = false;
        }),
        logMorphTargetValues: button(() => {
            const emotionValues: Record<string, number> = {};
            Object.keys(
                (nodes.EyeLeft as THREE.SkinnedMesh).morphTargetDictionary || {}
            ).forEach((key) => {
                if (key === "eyeBlinkLeft" || key === "eyeBlinkRight") return;
                const value = (nodes.EyeLeft as THREE.SkinnedMesh)
                    ?.morphTargetInfluences?.[
                (nodes.EyeLeft as THREE.SkinnedMesh)?.morphTargetDictionary?.[key] ??
                0
                    ];
                if ((value ?? 0) > 0.01) {
                    emotionValues[key] = value ?? 0;
                }
            });
            console.log(JSON.stringify(emotionValues, null, 2));
        }),
    });

    // Morph target controls
    const [, set] = useControls("MorphTarget", () =>
        Object.assign(
            {},
            ...Object.keys(
                (nodes.EyeLeft as THREE.SkinnedMesh).morphTargetDictionary || {}
            ).map((key) => {
                return {
                    [key]: {
                        label: key,
                        value: 0,
                        min: 0,
                        max: 1,
                        onChange: (val: number) => {
                            if (setupMode) {
                                lerpMorphTarget(key, val, 1);
                            }
                        },
                    },
                };
            })
        )
    );

    // Auto-blink functionality
    useEffect(() => {
        let blinkTimeout: NodeJS.Timeout | undefined;
        const nextBlink = () => {
            blinkTimeout = setTimeout(() => {
                setBlink(true);
                setTimeout(() => {
                    setBlink(false);
                    nextBlink();
                }, 200);
            }, THREE.MathUtils.randInt(1000, 5000));
        };
        nextBlink();
        return () => {
            if (blinkTimeout) clearTimeout(blinkTimeout);
        };
    }, []);

    return (
        <group ref={group} dispose={null}>
            <primitive object={nodes.Hips}/>
            <skinnedMesh
                name="EyeLeft"
                geometry={(nodes.EyeLeft as THREE.SkinnedMesh).geometry}
                material={materials["Wolf3D_Eye.001"]}
                skeleton={(nodes.EyeLeft as THREE.SkinnedMesh).skeleton}
                morphTargetDictionary={
                    (nodes.EyeLeft as THREE.SkinnedMesh).morphTargetDictionary
                }
                morphTargetInfluences={
                    (nodes.EyeLeft as THREE.SkinnedMesh).morphTargetInfluences
                }
            />
            <skinnedMesh
                name="EyeRight"
                geometry={(nodes.EyeRight as THREE.SkinnedMesh).geometry}
                material={materials["Wolf3D_Eye.001"]}
                skeleton={(nodes.EyeRight as THREE.SkinnedMesh).skeleton}
                morphTargetDictionary={
                    (nodes.EyeRight as THREE.SkinnedMesh).morphTargetDictionary
                }
                morphTargetInfluences={
                    (nodes.EyeRight as THREE.SkinnedMesh).morphTargetInfluences
                }
            />
            <skinnedMesh
                name="Wolf3D_Body"
                geometry={(nodes.Wolf3D_Body as THREE.SkinnedMesh).geometry}
                material={materials["Wolf3D_Body.001"]}
                skeleton={(nodes.Wolf3D_Body as THREE.SkinnedMesh).skeleton}
            />
            <skinnedMesh
                name="Wolf3D_Glasses"
                geometry={(nodes.Wolf3D_Glasses as THREE.SkinnedMesh).geometry}
                material={materials.Wolf3D_Glasses}
                skeleton={(nodes.Wolf3D_Glasses as THREE.SkinnedMesh).skeleton}
            />
            <skinnedMesh
                name="Wolf3D_Hair"
                geometry={(nodes.Wolf3D_Hair as THREE.SkinnedMesh).geometry}
                material={materials["Wolf3D_Hair.001"]}
                skeleton={(nodes.Wolf3D_Hair as THREE.SkinnedMesh).skeleton}
            />
            <skinnedMesh
                name="Wolf3D_Head"
                geometry={(nodes.Wolf3D_Head as THREE.SkinnedMesh).geometry}
                material={materials["Wolf3D_Skin.001"]}
                skeleton={(nodes.Wolf3D_Head as THREE.SkinnedMesh).skeleton}
                morphTargetDictionary={
                    (nodes.Wolf3D_Head as THREE.SkinnedMesh).morphTargetDictionary
                }
                morphTargetInfluences={
                    (nodes.Wolf3D_Head as THREE.SkinnedMesh).morphTargetInfluences
                }
            />
            <skinnedMesh
                name="Wolf3D_Outfit_Bottom"
                geometry={(nodes.Wolf3D_Outfit_Bottom as THREE.SkinnedMesh).geometry}
                material={materials["Wolf3D_Outfit_Bottom.001"]}
                skeleton={(nodes.Wolf3D_Outfit_Bottom as THREE.SkinnedMesh).skeleton}
            />
            <skinnedMesh
                name="Wolf3D_Outfit_Footwear"
                geometry={(nodes.Wolf3D_Outfit_Footwear as THREE.SkinnedMesh).geometry}
                material={materials["Wolf3D_Outfit_Footwear.001"]}
                skeleton={(nodes.Wolf3D_Outfit_Footwear as THREE.SkinnedMesh).skeleton}
            />
            <skinnedMesh
                name="Wolf3D_Outfit_Top"
                geometry={(nodes.Wolf3D_Outfit_Top as THREE.SkinnedMesh).geometry}
                material={materials["Wolf3D_Outfit_Top.001"]}
                skeleton={(nodes.Wolf3D_Outfit_Top as THREE.SkinnedMesh).skeleton}
            />
            <skinnedMesh
                name="Wolf3D_Teeth"
                geometry={(nodes.Wolf3D_Teeth as THREE.SkinnedMesh).geometry}
                material={materials["Wolf3D_Teeth.001"]}
                skeleton={(nodes.Wolf3D_Teeth as THREE.SkinnedMesh).skeleton}
                morphTargetDictionary={
                    (nodes.Wolf3D_Teeth as THREE.SkinnedMesh).morphTargetDictionary
                }
                morphTargetInfluences={
                    (nodes.Wolf3D_Teeth as THREE.SkinnedMesh).morphTargetInfluences
                }
            />
        </group>
    );
}

useGLTF.preload("models/Female.glb");
