import React from 'react';

import Spinner from '#rscv/Spinner';

import styles from './styles.scss';

interface Props {
    pending: boolean;
    text: string;
}

const Loading = ({ pending, text }: Props) => {
    if (!pending) {
        return null;
    }

    return (
        <div className={styles.loading}>
            <Spinner className={styles.spinner} />
            {text}
        </div>
    );
};

Loading.defaultProps = {
    pending: false,
    text: 'Loading data',
};

export default Loading;
