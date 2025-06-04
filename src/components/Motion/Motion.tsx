import React, { useLayoutEffect, useRef, useState } from "react";
import { motion, useAnimate, useInView, useMotionTemplate, useMotionValue, useMotionValueEvent, useScroll, useSpring, useTime, useTransform } from 'motion/react';

import styles from './Motion.module.scss';

const Motion = () => {
    const elementsList = Array.from({length: 100}, (_, i) => i);
    const scrollRef = useRef<HTMLDivElement>(null);
    const dragRef = useRef<HTMLDivElement>(null);
    // detects when the provided element is within the viewport.
    const isDragInView = useInView(dragRef);

    const [isListOpen, setIsListOpen] = useState(false);

    const time = useTime();

    console.log('drag in view: ', isDragInView)
    
    // Allows you to track page or element scrolling and get reactive scroll values ​​that can be used for animations.
    const { scrollXProgress } = useScroll({container: scrollRef});
    const [scrollDirection, setScrollirection] = useState<'Left' | 'Right' | null>(null);
    const scrollBoxBgc = useTransform(scrollXProgress, [0.1, 0.5, 1], ['red', 'yellow', 'blue']);

    // allows you to control animated values ​​outside of the standard useState.
    const motionX = useMotionValue(0);
    const motionY = useMotionValue(0);
  
    // allows you to make a soft movement, as if the object is attached to an invisible spring.
    const springX = useSpring(motionX, { stiffness: 1000, damping: 100 });
    const springY = useSpring(motionY, { stiffness: 1000, damping: 100 });

    const glowIntensity = useTransform(time, t => 0.5 + Math.sin(t / 500) * 0.5);

    const boxShadow = useMotionTemplate`
      0 0 20px rgba(0, 255, 255, ${glowIntensity}),
      0 0 40px rgba(0, 255, 255, ${glowIntensity})
    `;
  
    const hue = useTransform(time, t => t / 50 % 360);
    const background = useMotionTemplate`
      linear-gradient(135deg, hsl(${hue}, 100%, 70%), hsl(${(hue => (hue + 60) % 360)(hue.get())}, 100%, 50%))
    `;

    // Allows you to listen to changes in the MotionValue and trigger side effects whenever it is updated.
    useMotionValueEvent(scrollXProgress, "change", (current) => {
        const previous = scrollXProgress.getPrevious();

        if (previous) {
            const diff = current - previous
            setScrollirection(diff > 0 ? "Right" : "Left")
        }
      })

      const [scope, animate] = useAnimate();


      useLayoutEffect(() => {
        animate('li', { opacity: isListOpen ? 1 : 0 })
      }, [isListOpen])

    return (
        <div className="">
            <h1>Motion</h1>
            <p>{scrollDirection ? `to ${scrollDirection}` : 'Not scrolled yet'}</p>
            <div className={styles.scroll} ref={scrollRef}>
                <motion.div
                    className={styles['tag']}
                    style={{
                        scaleX: scrollXProgress,
                    }}
            />

                { elementsList.map((_) => (
                    <motion.div
                        style={{backgroundColor: scrollBoxBgc}}
                        className={styles.box}
                        whileHover={{scale: 1.2}}
                        initial={{ scale: 0 }} animate={{ scale: 1 }}
                    />
                )) }
            </div>      

            <motion.div
                ref={dragRef}
                drag
                className={styles.drager}
                style={{ x: springX, y: springY, boxShadow, background }}
            />     

            <div className={styles.collapse}>
                <button onClick={() => setIsListOpen((current) => !current)}>
                  Click Me
                </button>
                <motion.ul animate={{ height: isListOpen ? 'auto' : '0' }} ref={scope}>
                    {elementsList.map((el) => (
                        <li>{el}</li>
                    ))}
                </motion.ul>
            </div>
            <h1>hellp</h1>
        </div>
    )
}

export default Motion;