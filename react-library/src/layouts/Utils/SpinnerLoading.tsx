import React from 'react';

type SpinnerLoadingProps = {
  color?: string;
  size?: 'sm' | 'lg';
};

export const SpinnerLoading: React.FC<SpinnerLoadingProps> = ({
  color = 'primary',
  size,
}) => {
  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div
        className={`spinner-border text-${color} ${size ? `spinner-border-${size}` : ''}`}
        role="status"
      >
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};
