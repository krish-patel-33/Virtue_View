import Card from "../card/Card"

function List({ posts, onDelete }) {
  if (!posts || posts.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[200px] text-gray-500 text-xl p-5 w-full">
        <p>No properties found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-8 p-5 w-full">
      {posts.map(item => (
        <Card key={item.id} item={item} onDelete={onDelete} />
      ))}
    </div>
  );
}

export default List;
