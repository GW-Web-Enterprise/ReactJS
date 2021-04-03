import '@app/Components/DigSpinner.css';
import { VFC } from 'react';

export const DigSpinner: VFC = () => {
    return (
        <div role="progressbar" aria-valuetext="" className="dig-Spinner dig-Spinner--small dig-Spinner--inverse">
            <div className="dig-Spinner-content">
                <svg
                    className="dig-Spinner--track"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    focusable="false"
                    data-testid="digSpinnerTrack"
                >
                    <rect fill="none" strokeLinecap="square" strokeWidth="6" x="3" y="3" width="18" height="18"></rect>
                </svg>
                <div className="dig-Spinner-dot dig-Spinner-dot--one"></div>
                <div className="dig-Spinner-dot dig-Spinner-dot--two"></div>
            </div>
        </div>
    );
};
