import { useCallback, useRef, useState } from "react";

const useLongPress = (
    onLongPress,
    onClick,
    onLongPressEnd,
    { shouldPreventDefault = true, delay = 10000000000000 } = {}
) => {
    const [longPressTriggered, setLongPressTriggered] = useState(false);
    const timeout = useRef();
    const target = useRef();

    const start = useCallback(
        event => {
            if (shouldPreventDefault && event.target) {
                event.target.addEventListener("touchend", preventDefault, {
                    passive: false
                });
                target.current = event.target;
            }
            timeout.current = setTimeout(() => {
                onLongPress(event);
                setLongPressTriggered(true);
            }, delay);
        },
        [onLongPress, delay, shouldPreventDefault]
    );

    const clear = useCallback(
        (event, shouldTriggerClick = false) => {
            timeout.current && clearTimeout(timeout.current);
            // shouldTriggerClick && !longPressTriggered && onClick();
            setLongPressTriggered(false);
            !shouldTriggerClick && longPressTriggered && onLongPressEnd(event)
            if (shouldPreventDefault && target.current) {
                target.current.removeEventListener("touchend", preventDefault);

            }
        },

        [shouldPreventDefault, onClick, longPressTriggered]
    );

    return {
        onMouseDown: e => start(e),
        onTouchStart: e => start(e),
        onMouseUp: e => clear(e, false),
        onMouseLeave: e => console.log('Mouse is up'),
        //onTouchEnd: e => clear(e)
    };
};

const isTouchEvent = event => {
    return "touches" in event;
};

const preventDefault = event => {
    if (!isTouchEvent(event)) return;

    if (event.touches.length < 2 && event.preventDefault) {
        event.preventDefault();
    }
};

export default useLongPress;