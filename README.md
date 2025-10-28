Submitted by: Louis Miguel Sabaricos

This web app: Displays an AstroDash-style data dashboard that uses the Marvel Comics API to fetch and visualize Marvel character data. Users can search characters by name, filter by the number of comics they appear in, and view summary statistics such as average comics count, median story appearances, and description percentage.

Time spent: 5 hours in total

Required Features

The following required functionality is completed:

✅ The site has a dashboard displaying a list of data fetched using an API call

The dashboard displays 10+ unique Marvel characters, one per row

Each row shows Name, Comics count, Series count, Stories count, and Thumbnail

✅ useEffect React hook and async/await are used

✅ The app dashboard includes at least three summary statistics about the data

Total Characters (filtered)

Average Comics Available

Median Stories

% of Characters With Descriptions

✅ A search bar allows the user to search for an item in the fetched data

The search bar filters characters by their name (nameStartsWith)

The list of results dynamically updates as the user types into the search bar

✅ An additional filter allows the user to restrict displayed items by specified categories

A slider filter allows restricting by Minimum Comics count

The dashboard list dynamically updates as the user adjusts the slider filter

The following optional features are implemented:

✅ Multiple filters can be applied simultaneously (search + slider)

✅ Filters use different input types (text input + range slider)

✅ The user can navigate pages using “Prev” and “Next” buttons

The following additional features are implemented:

✅ Secure backend proxy (server.js) that generates MD5 hashes to protect the Marvel private key

✅ Responsive glass-style UI (sidebar, header, cards, and table layout)

✅ Error handling and loading states for failed or slow API responses

✅ Thumbnail images and hover tooltips showing character descriptions

Video Walkthrough

Here's a walkthrough of implemented user stories:

<img src='./walkthrough-marvel-dash.gif' title='walkthrough-marvel-dash' width='' alt='Video Walkthrough' />

GIF created with ScreenToGif (Windows)

Notes

The biggest challenge was authenticating with the Marvel API since it requires a secure MD5 hash of timestamp + privateKey + publicKey.
I solved this by setting up a lightweight Express proxy server (server.js) with environment variables to safely compute and forward the request.

I also had to fix the Vite ESM issue by renaming vite.config.js to vite.config.mjs.

License
Copyright 2025 Louis Miguel Sabaricos

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.