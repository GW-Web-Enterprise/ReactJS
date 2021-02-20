import { useEffect, useRef } from "react";

/**
 * This hook returns the old object reference if the compare function returns true
 * @example
 * function MyComponent({ obj }) {
  const [state, setState] = useState();

  // Use the previous obj value if the "id" property hasn't changed
  const objFinal = useMemoCompare(obj, (prev, next) => {
    return prev && prev.id === next.id;
  });

  // Here we want to fire off an effect if objFinal changes.
  // If we had used obj directly without the above hook and obj was technically a
  // new object on every render then the effect would fire on every render.
  // Worse yet, if our effect triggered a state change it could cause an endless loop
  // where effect runs -> state change causes rerender -> effect runs -> etc ...
  useEffect(() => {
    // Call a method on the object and set results to state
    return objFinal.someMethod().then((value) => setState(value));
  }, [objFinal]);

  // So why not pass [obj.id] as the dependency array instead?
  useEffect(() => {
    // Then eslint-plugin-hooks would rightfully complain that obj is not in the
    // dependency array and we'd have to use eslint-disable-next-line to work around that.
    // It's much cleaner to just get the old object reference with our custom hook.
    return obj.someMethod().then((value) => setState(value));
  }, [obj.id]);

  return <div> ... </div>;
}
 * */
type CompareFunc<T> = (previous: T, next: T) => boolean
export function useMemoCompare<T>(next: T, compare: CompareFunc<T>) {
    // useRef() creates a mutable object that will keep the same reference between renders
    const previousRef = useRef(next);
    const previous = previousRef.current;

    // Pass previous and next value to compare function to check if them equal.
    const isEqual = compare(previous, next);

    // useEffect with no 2nd arg runs at every render
    useEffect(() => {
        if (!isEqual) {
            previousRef.current = next;
        }
    });
    return isEqual ? previous : next;
}
