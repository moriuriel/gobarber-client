import React, { useEffect } from 'react';
import { FiXCircle, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { ToastMessage, useToast } from '../../../hooks/toast';

import { Container } from './styles';

interface ToastProps {
  message: ToastMessage;
  style: object;
}

const icons = {
  info: <FiAlertCircle size={24} />,
  success: <FiCheckCircle size={24} />,
  error: <FiXCircle size={24} />,
};

const Toast: React.FC<ToastProps> = ({ message, style }) => {
  const { removeToast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(message.id);
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [message.id, removeToast]);

  return (
    <>
      <Container
        type={message.type}
        hasDescription={Number(!!message.description)}
        style={style}
      >
        {icons[message.type || 'info']}
        <div>
          <strong>{message.title}</strong>
          <p>{message.description}</p>
        </div>
        <button type="button" onClick={() => removeToast(message.id)}>
          <FiXCircle />
        </button>
      </Container>
    </>
  );
};

export default Toast;
