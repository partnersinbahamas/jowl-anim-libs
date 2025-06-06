import React, { useEffect, useState } from 'react';
import styles from './ReactSpring.module.scss';

import {
  animated,
  useSprings,
  useSpringValue,
  useTransition,
  useSpringRef,
  useChain,
  useTrail,
} from '@react-spring/web';

const ReactSpring = () => {
  const [direction, setDirection] = useState<boolean>(false);
  const [list, setList] = useState([1, 2, 3]);

  const items = ['React', 'Spring', 'Trail', 'Animation'];

  const springsRef = useSpringRef();
  const transitonRef = useSpringRef();

  const [springs, api] = useSprings(2, () => ({
    ref: springsRef,
    from: { x: 0, width: 80 },
  }));

  const [trail, trailApi] = useTrail(items.length, () => ({
    from: { opacity: 0, transform: 'translateY(20px)' },
  }));

  const [transitions, _] = useTransition(list, () => ({
    ref: transitonRef,
    keys: item => item,
    from: { opacity: 0, scale: 0 },
    enter: { opacity: 1, scale: 1 },
    leave: { opacity: 0, scale: 1 },
  }));

  const opacity = useSpringValue(0, {
    config: {
      mass: 2,
      friction: 5,
      tension: 80,
    },
  });

  useChain([springsRef, transitonRef], [0, 0.5])

  const handleClick = () => {
    setDirection(current => !current);

    const springWidth = direction ? 650 : 80;
    const springX = direction ? window.innerWidth - (springWidth + 20) : 0;

    api.start({
      to: { x: springX, width: springWidth },
    });

    opacity.start(direction ? 0 : 1);

    if (direction) {
      trailApi.start({to: { opacity: 1, transform: 'translateY(0px)' }});
    } else {
      trailApi.start({to: { opacity: 0, transform: 'translateY(20px)' }});
    }

    setList(current => current.filter(el => el !== 3));
  };

  return (
    <section className={styles.wrapper}>
      <animated.h2 style={{ opacity }}>react-spring</animated.h2>

      {springs.map(spring => (
        <animated.div
          onClick={handleClick}
          className={styles.box}
          style={{ ...spring }}
        />
      ))}

      {transitions((style, item) => (
        <animated.div key={item} style={style}>
          {item}
        </animated.div>
      ))}

    <div style={{ padding: '2rem' }}>
      {trail.map((style, index) => (
        <animated.div key={index} style={style}>
          {items[index]}
        </animated.div>
      ))}
    </div>
    </section>
  );
};

export default ReactSpring;
