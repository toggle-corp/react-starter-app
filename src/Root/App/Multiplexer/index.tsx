import Loadable from 'react-loadable';
import React, { Fragment } from 'react';
import { Router } from '@reach/router';
import { _cs } from '@togglecorp/fujs';

import DangerButton from '#rsca/Button/DangerButton';

import Loading from '#components/Loading';
import Navbar from '#components/Navbar';
import errorBound from '#components/errorBound';
import helmetify from '#components/helmetify';

import { routeSettings } from '#constants';
import styles from './styles.scss';

// LOADING
const loadingStyle: React.CSSProperties = {
    zIndex: 1111,
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    // width: '300px',
    // height: '60px',
    display: 'flex',
    padding: 10,
    textAlign: 'center',
    alignItems: 'baseline',
    justifyContent: 'center',
    fontSize: '18px',
    backgroundColor: '#ffffff',
    border: '1px solid rgba(255, 0, 0, 0.2)',
    borderRadius: '3px',
};

interface LoadOptions {
    error: string;
    retry: () => void;
}

function reloadPage(): void {
    window.location.reload(false);
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const ErrorInPage = () => (
    <div style={loadingStyle}>
        Some problem occured.
        <DangerButton
            transparent
            onClick={reloadPage}
        >
            Reload
        </DangerButton>
    </div>
);

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const RetryableErrorInPage = ({ error, retry }: LoadOptions) => {
    console.error(error);
    return (
        <div style={loadingStyle}>
            Some problem occured.
            <DangerButton
                onClick={retry}
                transparent
            >
                Reload
            </DangerButton>
        </div>
    );
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const LoadingPage = ({ error, retry }: LoadOptions) => {
    if (error) {
        return (
            <RetryableErrorInPage
                error={error}
                retry={retry}
            />
        );
    }
    return (
        <Loading
            text="Loading Page"
            pending
        />
    );
};

const routes = routeSettings.map(({ load, ...settings }) => {
    const Component = errorBound<typeof settings>(ErrorInPage)(
        helmetify(
            Loadable({
                loader: load,
                loading: LoadingPage,
            }),
        ),
    );

    return (
        <Component
            key={settings.name}
            {...settings}
        />
    );
});

interface State {
}
interface Props {
    pending: boolean;
}

class Multiplexer extends React.PureComponent<Props, State> {
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    private renderRoutes = () => {
        const { pending } = this.props;
        if (pending) {
            return (
                <Loading
                    text="Loading Resources"
                    pending
                />
            );
        }

        return (
            <Router>
                {routes}
            </Router>
        );
    }

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    public render() {
        return (
            <Fragment>
                <Navbar />
                <div className={_cs(styles.appMainContent, 'app-main-content')}>
                    {this.renderRoutes()}
                </div>
            </Fragment>
        );
    }
}

export default Multiplexer;
