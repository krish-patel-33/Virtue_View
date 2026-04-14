import Filter from "../../components/filter/Filter";
import Card from "../../components/card/Card";
import Map from "../../components/map/Map";
import { Await, useLoaderData } from "react-router-dom";
import { Suspense } from "react";

function ListPage() {
  const data = useLoaderData();

  return (
    <div className="flex h-[calc(100vh-100px)]">
      <div className="flex-[3] overflow-y-auto p-8">
        <div className="flex flex-col gap-5">
          <Filter />
          <Suspense fallback={<p className="text-gray-500">Loading...</p>}>
            <Await
              resolve={data.postResponse}
              errorElement={<p className="text-red-500">Error loading posts!</p>}
            >
              {(postResponse) =>
                (postResponse.data?.posts || []).map((post) => (
                  <Card key={post.id} item={post} />
                ))
              }
            </Await>
          </Suspense>
        </div>
      </div>
      <div className="flex-[2] sticky top-0 h-full">
        <Suspense fallback={<p className="text-gray-500">Loading...</p>}>
          <Await
            resolve={data.postResponse}
            errorElement={<p className="text-red-500">Error loading posts!</p>}
          >
            {(postResponse) => <Map items={postResponse.data?.posts || []} />}
          </Await>
        </Suspense>
      </div>
    </div>
  );
}

export default ListPage;
