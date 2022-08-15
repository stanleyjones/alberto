import { useParams } from "react-router-dom"
import {
  Box,
  Breadcrumb,
  Container,
  Spinner,
  Text,
  Alert,
  AlertDescription,
  AlertIcon,
} from "components"
import { base64ToArrayBuffer } from "helper/convert"
import {
  MultisigActions,
  SubmittedMultisigTxnDetails,
  useTransactionsList,
} from "features/transactions"
import { BoundType, MultisigSubmitEvent } from "many-js"

export function TransactionDetails() {
  return (
    <Container mt={4} maxW="md">
      <Box mb={4}>
        <Breadcrumb>
          <Breadcrumb.BreadcrumbItem>
            <Breadcrumb.BreadcrumbLink to="">
              Transaction Details
            </Breadcrumb.BreadcrumbLink>
          </Breadcrumb.BreadcrumbItem>
        </Breadcrumb>
      </Box>
      <Box bgColor="white" rounded="md" shadow="md" position="relative" p={4}>
        <TxnDetails />
      </Box>
    </Container>
  )
}

function TxnDetails() {
  const { txnId } = useParams()

  const txnIdBytes = txnId
    ? base64ToArrayBuffer(decodeURIComponent(txnId))
    : undefined

  const {
    data,
    isLoading,
    error: txnListError,
  } = useTransactionsList({
    filter: {
      ...(txnIdBytes
        ? {
            txnIdRange: [
              {
                boundType: BoundType.inclusive,
                value: txnIdBytes,
              },
              {
                boundType: BoundType.inclusive,
                value: txnIdBytes,
              },
            ],
          }
        : {}),
    },
  })
  const txn = data?.transactions?.[0] as MultisigSubmitEvent

  if (txnListError) {
    return (
      <Alert status="warning">
        <AlertIcon />
        <AlertDescription>{txnListError}</AlertDescription>
      </Alert>
    )
  }
  if (!isLoading && !txn) {
    return (
      <Alert status="warning">
        <AlertIcon />
        <AlertDescription>
          <Text>Transaction not found.</Text>
        </AlertDescription>
      </Alert>
    )
  }
  return (
    <>
      {isLoading ? (
        <Box
          position={txn ? "absolute" : "relative"}
          display="flex"
          alignItems="center"
          justifyContent="center"
          w="full"
        >
          <Spinner size="lg" />
        </Box>
      ) : null}

      {txn ? (
        <>
          <SubmittedMultisigTxnDetails multisigTxn={txn} />
          <MultisigActions
            accountAddress={txn?.account}
            onActionDone={undefined}
            txnToken={txn?.token}
          />
        </>
      ) : null}
    </>
  )
}