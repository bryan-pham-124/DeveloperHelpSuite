// app/components/modal.tsx



// I was originally going to use a modal, but it did not work well with scrolling down long content
import { useNavigate } from '@remix-run/react'

interface props {
  children: React.ReactNode
  isOpen: boolean
  ariaLabel?: string
  className?: string
  setIsModalOpen: Function
}

export const Modal: React.FC<props> = ({ children, isOpen, ariaLabel, className, setIsModalOpen }) => {
  const navigate = useNavigate();
  
  if (!isOpen) return null
  
  return (
    <>
      <div
        className="fixed inset-0 overflow-y-auto bg-gray-600 bg-opacity-80"
        aria-labelledby={ariaLabel ?? 'modal-title'}
        role="dialog"
        aria-modal="true"
        onClick={() =>  setIsModalOpen((prevData: Boolean) => !prevData)}
      ></div>
      <div className="fixed inset-0 pointer-events-none flex justify-center items-center max-h-screen overflow-scroll">
        <div className={`${className} p-4 pointer-events-auto max-h-screen md:rounded-xl`}>
          {/* This is where the modal content is rendered  */}
          {children}
        </div>
      </div>
    </>
  )
}