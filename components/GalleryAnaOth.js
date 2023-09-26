'use client';
import CloudinaryImage from '@/components/Cloudinary-image';
import {useState, useEffect} from 'react';

export async function getData() {
  const result = await fetch('http://localhost:3000/searchapi', {
    cache: 'no-cache',
  });

  if (!result.ok) {
    throw new Error('Failed to fetch');
  }
  return result.json();
}

//shuffle function to display different images.
function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

function chooseFolder(array) {
  return array.filter(data => data.folder === 'film/others');
}

export default function GalleryAnaOth() {
  const [initialData, setInitialData] = useState(null);
  useEffect(() => {
    getData().then(data => {
      let filteredData = chooseFolder(data.data);
      let shuffledData = shuffle(filteredData);
      data.data = shuffledData;
      setInitialData(data);
    });
  }, []);

  const MAX_COLUMNs = 3;

  function getColumns(colIndex) {
    if (!initialData || !initialData.data) {
      return [];
    }
    return initialData.data.filter(
      (data, idx) => idx % MAX_COLUMNs === colIndex,
    );
  }
  return (
    <main className="ml-[20%] grid grid-cols-3 gap-2 p-4 pr-10">
      {[getColumns(0), getColumns(1), getColumns(2)].map((column, idx) => (
        <div key={idx} className="flex flex-col space-y-2">
          {column.map((data, index) => (
            <CloudinaryImage
              key={data.public_id}
              src={data.public_id}
              height={data.height}
              width={data.width}
              alt={data.public_id}
              format={'webp'}
              folder={data.folder}
              // rawTransformations={['c_scale,w_400']}
            />
          ))}
        </div>
      ))}
    </main>
  );
}
