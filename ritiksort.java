public class ritiksort{

    public void sort(int[] array) {

        int min = array[0];
        int max = array[0];


        //Remove all duplicates, add them in later

        int[] amounts;
        int[] uniques;


        for (int i = 0; i < array.length; i++) {

            if (array[i] < min) min = array[i];
            if (array[i] > max) max = array[i];

        }

        amounts = new int[max + 1];
        uniques = new int[max - min + 1];

        int uniquecount = 0;

        for (int i = 0; i < array.length; i++) {

            if (amounts[array[i]] == 0) {
                uniques[uniquecount] = array[i];
                uniquecount++;
            }

            amounts[array[i]]++;
        }

        int width = (max - min) / uniquecount + 1;
        int arrwidth = width + 3;
        int height = uniquecount;

        int[][] counter = new int[height][arrwidth];

        boolean containsZero = false;

        for (int i = 0; i < uniquecount; i++) {

            int value = uniques[i];

            if (value == 0) {
                containsZero = true;
                continue;
            }

            int element = value - min;

            int heightspot = element / width;
            int widthspot = element % width;
            counter[heightspot][widthspot] = value;
            if (widthspot + 1 > counter[heightspot][arrwidth - 2]) {
                counter[heightspot][arrwidth - 2] = widthspot + 1;
            }
            if (widthspot + 1 < counter[heightspot][arrwidth - 3] || counter[heightspot][arrwidth - 3] == 0) {
                counter[heightspot][arrwidth - 3] = widthspot + 1;
            }
            counter[heightspot][arrwidth - 1]++;

        }

        int index = 0;

        for (int i = 0; i < counter.length; i++) {

            if (counter[i][arrwidth - 1] == 0) continue;

            int imin = counter[i][arrwidth - 3];
            int imax = counter[i][arrwidth - 2];


            for (int j = imin - 1; j <= imax - 1; j++) {

                if (counter[i][j] != 0) {
                    //not optimized!!!!!!

                    if (containsZero
                            && counter[i][j] > 0
                            && ((index > 0 && array[index - 1] < 0))
                    ) {

                        for (int a = 0; a < amounts[counter[i][j]]; a++) {
                            array[index] = 0;
                            index++;
                            if (index == array.length) return;
                        }

                    }


                    for (int a = 0; a < amounts[counter[i][j]]; a++) {
                        array[index] = counter[i][j];
                        index++;
                        if (index == array.length) return;
                    }

                }
            }

        }
    }


}
