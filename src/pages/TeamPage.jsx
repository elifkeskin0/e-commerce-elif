const team = [
  {
    name: "Gökhan Özdemir",
    role: "Project Manager",
    image: "https://media.licdn.com/dms/image/D4D03AQG2S7YjGwD6nQ/profile-displayphoto-shrink_400_400/0/1700000000000?e=2147483647&v=beta&t=profile",
  },
  {
    name: "Elif",
    role: "Full Stack Developer",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Workintech Team",
    role: "Product & QA",
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80",
  },
];

export default function TeamPage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-10">
      <div className="flex flex-col gap-2 text-center">
        <span className="text-sm font-bold text-muted">Team</span>
        <h1 className="text-3xl font-bold text-ink">Proje Ekibi</h1>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {team.map((member) => (
          <div key={member.name} className="flex flex-col overflow-hidden rounded-md border border-slate-200 bg-white">
            <img src={member.image} alt={member.name} className="aspect-square w-full object-cover" />
            <div className="flex flex-col gap-2 p-5 text-center">
              <span className="text-lg font-bold text-ink">{member.name}</span>
              <span className="text-sm font-bold text-brand">{member.role}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
