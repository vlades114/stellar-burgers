import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useParams } from 'react-router-dom';
import { useSelector } from '@store';
import { getIngredientById } from '@slices';

type Params = {
  ingredientId: string;
};

export const IngredientDetails: FC = () => {
  const { ingredientId } = useParams<Params>();

  const ingredientData = useSelector((state) =>
    getIngredientById(state, ingredientId)
  );

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
