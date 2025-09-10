import Logo from "@/components/logo";


export function Footer() {
  return (
    <footer className="bg-white border-t border-neutral-200 py-2 mt-auto">
      <div className="justify-center align-center block relative px-4 sm:px-6 lg:px-8">


        <div className=" mt-2 p-2 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-neutral-600">© {new Date().getFullYear()} IlaroCARE. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-neutral-600 hover:text-neutral-900 text-sm">Facebook</a>
            <a href="#" className="text-neutral-600 hover:text-neutral-900 text-sm">Twitter</a>
            <a href="#" className="text-neutral-600 hover:text-neutral-900 text-sm">Instagram</a>
            <a href="#" className="text-neutral-600 hover:text-neutral-900 text-sm">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  );
}