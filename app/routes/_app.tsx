import { useLocalStorage } from "usehooks-ts";
import { Anchor, Box, Flex, Modal, TextInput } from "@mantine/core";
import { NavLink, Outlet } from "@remix-run/react";
import { useEffect } from "react";
import { getHotkeyHandler, useDisclosure } from "@mantine/hooks";
import { AppContext } from "../utils/app-context";

export default function AppLayout() {
  const [username, setUsername] = useLocalStorage("username", "");

  const [
    isUsernameModalOpen,
    { close: closeUsernameModal, open: openUsernameModal },
  ] = useDisclosure();

  const hasUsername = Boolean(username);

  useEffect(() => {
    if (!hasUsername) {
      openUsernameModal();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasUsername]);

  return (
    <Box maw={800} mx="auto" px={20} py={40}>
      <Flex mb={20} gap={20}>
        <Anchor component={NavLink} to="/">
          Home
        </Anchor>
        <Anchor component={NavLink} to="/agents">
          Agents
        </Anchor>
        <Anchor component={NavLink} to="/agents/create">
          Create agent
        </Anchor>

        <div className="spacer"></div>

        <Box>
          {username ? (
            <Anchor onClick={openUsernameModal}>{username}</Anchor>
          ) : (
            <Anchor onClick={openUsernameModal}>Set username</Anchor>
          )}
        </Box>
      </Flex>

      <AppContext.Provider value={{ username }}>
        <Outlet />
      </AppContext.Provider>

      <UserNameModal
        username={username}
        setUsername={(username) => {
          setUsername(username);
        }}
        isOpen={isUsernameModalOpen}
        onClose={closeUsernameModal}
      />
    </Box>
  );
}

function UserNameModal({
  isOpen,
  username,
  onClose,
  setUsername,
}: {
  isOpen: boolean;
  username: string;
  onClose: () => void;
  setUsername: (username: string) => void;
}) {
  return (
    <Modal
      title="Enter your username"
      size="sm"
      opened={isOpen}
      onClose={onClose}
    >
      <TextInput
        value={username}
        onChange={(event) => setUsername(event.currentTarget.value)}
        placeholder="Username"
        onKeyDown={getHotkeyHandler([["Enter", onClose]])}
        required
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus={true}
      />
    </Modal>
  );
}
