export default function MediaPlayer({ children, local }) {
  return (
    <>
      <h6 className="font-sans font-thin text-2xl my-3 text-center">
        All Stream Windows
      </h6>
      <div className="p-3 grid grid-cols-2 auto-rows-auto min-h-[85vh] gap-x-4 mt-6 mx-4 border border-blue-500">
        {local}
        {children}
      </div>
    </>
  );
}
