export const showErrorModal = () => {
  const modalDiv = document.createElement('div');
  modalDiv.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
    `;

  const modalContent = document.createElement('div');
  modalContent.style.cssText = `
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      text-align: center;
    `;

  modalContent.innerHTML = `
      <h3 style="color: #F34602; margin-bottom: 15px;">Error de Conexión</h3>
      <p style="margin-bottom: 15px;">Error al conectar con el servidor, comunicate inmediatamente con el departamento de sistemas</p>
      <button style="background: #F34602; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">Aceptar</button>
    `;

  modalDiv.appendChild(modalContent);
  document.body.appendChild(modalDiv);

  const button = modalContent.querySelector('button');
  button?.addEventListener('click', () => {
    document.body.removeChild(modalDiv);
  });
};
