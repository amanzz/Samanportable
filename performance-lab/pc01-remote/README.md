# PC01-REL-05E remote performance laboratory

This isolated GitHub Actions harness compares immutable Control A (`4dc9b4e6`) and Candidate B (`c04737f2`) on one Ubuntu runner. It enforces 390×844 DPR1 mobile and 1440×900 DPR1 desktop viewports, blocks non-local requests without changing application source, runs smoke gates, paired measurements, DOM/long-task/LCP collection, and an image-optimizer diagnostic. It never targets production branches.
