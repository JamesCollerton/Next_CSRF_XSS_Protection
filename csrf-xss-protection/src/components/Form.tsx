import React, { useState } from 'react';

// We declare an interface so that TypeScript
// knows what kind of props we are expecting.
interface ListItems {
  items: Array<number>
}

// Now we take in our list of items 
const List = (listItems: ListItems) => {

  // Here we introduce our state, along with a
  // method for updating it.
  const [items, setItems] = useState(listItems.items)

  // Here we introduce our event handler. Notice how
  // we use the state mutation function and concat to
  // change the array, we don't mutate the array directly.
  // Instead we create a new array and pass it to the
  // mutation function.
  const handleClick = () => {
    setItems(items.concat(Math.random()))
  }

  // Here we map out each of our list items
  // to JSX, which we can later render.
  const listItemsLi = items.map(num => <li key={num}>{num}</li>)

  return (
    <>
      <div>
        <h1>Our list goes here!</h1>
        {/* Here we render all of our list items */}
        <ul>
          {listItemsLi}
        </ul>
        {/* Now we pass the handler, and have it triggered
        when we click the button. Recognise we are passing
        a reference to the method, not calling it! */}
        <button onClick={handleClick}>
          Add an item!
        </button>
      </div>
    </>
  );
};

// Finally we export our component for use in
// our page.
export default List;