import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
//import './Modal.css'

const ModalExample = ({id, name, modalState, changeModalState, modalHeader, onClosed ,modalBody, modalFooter, button1, button2, button3, className, style, centered, size}) => {
  
  return (
  <>
    <Modal 
    id= {id ? id : undefined }
    name= {name ? name : undefined }
    isOpen={modalState ? modalState : false} 
    toggle={changeModalState ? changeModalState : undefined} 
    onClosed= {onClosed ? onClosed : undefined}
    className={className ? className : undefined}
    style={style ? style : undefined}
    centered= {centered ? centered : true} 
    size={size ? size : ''}
    // backdrop={false}
    >
    
      

      { modalHeader &&
        <ModalHeader toggle={changeModalState ? changeModalState : undefined }>
          {modalHeader}
        </ModalHeader> 
      }

      
      { modalBody &&
        <ModalBody>
          {modalBody}
        </ModalBody>
      }
      
      { modalFooter &&
        <ModalFooter>
          {button1 && <button >btn1</button>}
          {button2 && <button >btn2</button>}
          {button3 && <button >btn3</button>}
      </ModalFooter>
      }


    </Modal>

  </>
);
}

export default ModalExample;