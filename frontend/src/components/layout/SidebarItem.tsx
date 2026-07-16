type Props = {
  title: string
}

export default function SidebarItem({
  title,
}: Props) {

  return (
    <div className="group p-3 rounded-xl text-white hover:bg-zinc-800 cursor-pointer flex justify-between items-center">

      <span className="truncate">
        {title}
      </span>

      <button className="hidden group-hover:block px-2">
        ⋮
      </button>

    </div>
  )
}