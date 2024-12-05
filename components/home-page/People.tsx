const People = ({ people, isReverse }) => {
  const peopleList = people.concat(people);
  return (
    <div className="overflow-hidden shadow-sm p-4">
      <div className="marquee-wrapper overflow-hidden w-full">
        <div
          className={`marquee-content flex gap-4 items-center w-full ${
            isReverse ? "animate-marquee-reverse" : "animate-marquee"
          }`}
        >
          {peopleList.map((person, index) => (
            <div
              key={index}
              className="px-6 py-4 bg-gray-50 border rounded-lg shadow-md border-black h-60 flex-shrink-0"
              style={{ width: "300px" }}
            >
              <div className="relative group">
                <div className="flex items-center space-x-4">
                  <img
                    src={person.image}
                    className="w-14 h-14 bg-center bg-cover border rounded-full"
                    alt={person.name}
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {person.name}
                    </h3>
                    <p className="text-gray-500 text-sm">{person.zawod}</p>
                  </div>
                </div>
                <p className="mt-4 text-gray-700 text-base leading-relaxed">
                  {person.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default People;
