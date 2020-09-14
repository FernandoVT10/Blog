import { Seeder } from "mongoose-data-seed";
import Article from "../server/models/Article";
import Category from "../server/models/Category";

const data = [
    {
        categories: ["Documental", "Animals"],
        dayViews: 16,
        monthViews: 165,
        totalViews: 1602,
        title: "The owl the best animal in this planet.",
        content: "[{\"attributes\":{\"bold\":true},\"insert\":\"Owls\"},{\"insert\":\" are birds from the order \"},{\"attributes\":{\"bold\":true},\"insert\":\"Strigiformes\"},{\"insert\":\", which includes over 200 species of mostly solitary and nocturnal birds of prev typified by an upright stance, a large, broad head, binocular vision, binocular hearing, sharp talons, and feathers adapted for silent flight. Exceptions include the diurnal nothern hawl - owl and the gregarious burrowing owl.\\nOwls hunt mostly small mammals, insects, and other birds, although a few species specialize in hunting fish. They are found in all regions of the Earth except polar ice caps and some remote islands.\\nOwls are divided into two families: the true(or typical)\"},{\"attributes\":{\"color\":\"#7e72ff\",\"link\":\"https://en.wikipedia.org/wiki/True_owl\"},\"insert\":\" \"},{\"insert\":\"owl family, Strigidae, and the barn owl family, Tytonidae.\\nA group of owls is called a \\\"parliament.\\n\"}]",
        description: "Here we are going to explain you why the owl is te best animal on this planet.",
        cover: "1599593421678.jpg"
    },
    {
        categories: ["Landscapes", "Wallpapers"],
        dayViews: 30,
        monthViews: 459,
        totalViews: 1980,
        title: "Awesome landscapes",
        content: "[{\"insert\":\"First landscape:\\n\"},{\"insert\":{\"image\":\"/img/articles/content/1599934783584.jpg\"}},{\"insert\":\"\\nSecond landscape:\\n\"},{\"insert\":{\"image\":\"/img/articles/content/1599934986681.jpg\"}},{\"insert\":\"\\nThird landscape:\\n\"},{\"insert\":{\"image\":\"/img/articles/content/1599935037833.jpg\"}},{\"insert\":\"\\n\"}]",
        description: "Here we show you some incredible landscapes.",
        cover: "1599935048206.jpg"
    },
    {
        categories: ["Tutorials", "Code"],
        dayViews: 379,
        monthViews: 2309,
        totalViews: 5800,
        title: "How to create a Fibonacci function in JavaScript",
        content: "[{\"insert\":\"To do this we have 2 ways to do it.\\nWe can do it with a loop or with a recursive function.\\n\\nFirst we're going to do it with a loop, in this case a \"},{\"attributes\":{\"bold\":true},\"insert\":\"while\"},{\"insert\":\".\\n﻿function fibonacci(n) {\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"  let a = 0;\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"  let b = 1;\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"  \"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"  while(n > 1) {\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"    n--;\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"    a += b;\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"    b = a - b;\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"  }\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\\n\"},{\"insert\":\"  return a;\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"}\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"And now with the recursive function.\\nfunction fibonacci(n) {\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"  if(n <= 1) {\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"    return 0;\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"  }\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\\n\"},{\"insert\":\"  if(n === 2) {\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"    return 1;\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"  }\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\\n\"},{\"insert\":\"  return fibonacci(n - 1) + fibonacci(n - 2);\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"}\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"I personally recommend the loop, it's much better at optimization than the recursive function.\\n\"}]",
        description: "Here we expain how to create a function that returns a Fibonacci number.",
        cover: "1599937135745.jpg"
    },
    {
        categories: ["Documental"],
        dayViews: 109,
        monthViews: 1180,
        totalViews: 2590,
        title: "Why the rain is so incredible",
        content: "[{\"insert\":\"Why the rain is so incredible?.\\nThis is 1 reason\"},{\"attributes\":{\"list\":\"ordered\"},\"insert\":\"\\n\"},{\"insert\":\"This is other reason\"},{\"attributes\":{\"list\":\"ordered\"},\"insert\":\"\\n\"},{\"insert\":\"This is other reason\"},{\"attributes\":{\"list\":\"ordered\"},\"insert\":\"\\n\"},{\"insert\":\"This is other reason\"},{\"attributes\":{\"list\":\"ordered\"},\"insert\":\"\\n\"}]",
        description: "Here we explain you why the rain is so incredible.",
        cover: "1599938449545.jpg",
    },
    {
        categories: ["Documental"],
        dayViews: 480,
        monthViews: 1780,
        totalViews: 7632,
        title: "The Black Holes",
        content: "[{\"insert\":\"A black hole is a region of spacetime where gravity is so strong that nothing—no particles or even electromagnetic radiation such as light—can escape from it. The theory of general relativity predicts that a sufficiently compact mass can deform spacetime to form a black hole. The boundary of the region from which no escape is possible is called the event horizon. Although the event horizon has an enormous effect on the fate and circumstances of an object crossing it, according to general relativity it has no locally detectable features. In many ways, a black hole acts like an ideal black body, as it reflects no light. Moreover, quantum field theory in curved spacetime predicts that event horizons emit Hawking radiation, with the same spectrum as a black body of a temperature inversely proportional to its mass. This temperature is on the order of billionths of a kelvin for black holes of stellar mass, making it essentially impossible to observe.\\n\"}]",
        description: "What are black holes?",
        cover: "1599938810602.jpg",
    },
    {
        categories: ["Landscapes", "Wallpapers"],
        dayViews: 321,
        monthViews: 3219,
        totalViews: 9234,
        title: "Awesome Wallpapers",
        content: "[{\"insert\":\"First wallpaper\\n\"},{\"insert\":{\"image\":\"/img/articles/content/1599939042289.jpg\"}},{\"insert\":\"\\nSecond wallpaper:\\n\"},{\"insert\":{\"image\":\"/img/articles/content/1599939066117.jpg\"}},{\"insert\":\"\\n\"}]",
        description: "Some awesome wallpapers.",
        cover: "1599939080474.jpg"
    }
]

class ArticlesSeeder extends Seeder {
    async shouldRun() {
        return Article.countDocuments().exec().then(count => count === 0);
    }

    async run() {
        for(const i in data) {
            data[i].categories = await Category.find({ name: data[i].categories });
        }

        return Article.insertMany(data);
    }
}

export default ArticlesSeeder;
