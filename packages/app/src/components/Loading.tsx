import {
  Flex,
  Loading,
  LoadingSize,
  LoadingColor,
} from "@ditointernet/uai-components";

const LoadingCard = () => {
  return (
    <Flex height="100%" alignItems="center" justifyContent="center">
      <Loading size={LoadingSize.LARGE} color={LoadingColor.GREEN} />
    </Flex>
  );
};

export default LoadingCard;
