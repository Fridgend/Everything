#include <iostream>
#include <string>
#include <map>
#include <vector>
#include <utility>
#include <fstream>
#include <algorithm>
#include <queue>
#include <unordered_map>

enum gate_type {
    NOT_GATE = 1,
    AND_GATE = 2,
    OR_GATE = 3,
    XOR_GATE = 4,
    INPUT = 5,
    OUTPUT = 6,
};

class Gate {
private:
    static int id_counter;
    int id;

public:
    gate_type gtype;
    int connections = 0;
    explicit Gate (gate_type new_gtype) {
        gtype = new_gtype;
        id = std::stoi(std::to_string(gtype) + std::to_string(id_counter++));
    };

    [[nodiscard]] bool get_out_value(bool input1, bool input2) const {
        if (gtype == NOT_GATE) { return (not input1); }
        else if (gtype == AND_GATE) { return (input1 and input2); }
        else if (gtype == OR_GATE) { return (input1 or input2); }
        else if (gtype == XOR_GATE) { return (input1 xor input2); }
        else { return false; }
    }

    void add_connection() { connections++; }
    [[nodiscard]] int get_id() const { return id; }

    [[nodiscard]] bool get_availability() const {
        if (gtype == NOT_GATE or gtype == OUTPUT) { return connections == 0; }
        else if (gtype != INPUT) { return connections < 2; }
        else { return false; }
    }

    bool operator<(const Gate& other) const {
        if (gtype != other.gtype) {
            return gtype < other.gtype;
        }
        return id < other.id;
    }
    bool operator==(const Gate& other) const {
        return this->id == other.id;
    }
};
int Gate::id_counter = 0;

struct GateHash {
    std::size_t operator()(const Gate& gate) const {
        return std::hash<int>()(gate.get_id());
    }
};

int manhattan_distance(const std::vector<bool>& v1, const std::vector<bool>& v2) {
    int distance = 0;
    for (size_t i = 0; i < v1.size(); ++i) {
        distance += std::abs(v1[i] - v2[i]);
    }
    return distance;
}

int calculate_heuristic(
    const std::vector<std::pair<Gate, std::vector<Gate>>>& given_solution,
    const std::vector<std::unordered_map<Gate, bool, GateHash>>& output_maps
) {
    //std::cout << "-----------------------------------------------------------------------" << std::endl;
    //for (const std::pair<Gate, std::vector<Gate>>& gate_pair : given_solution) {
    //    std::cout << gate_pair.first.get_id() << " <- ";
    //    for (Gate gate : gate_pair.second) {
    //        std::cout << gate.get_id() << ",";
    //    }
    //    std::cout << std::endl;
    //}

    int cost = 0;
    for (const std::unordered_map<Gate, bool, GateHash>& out_map : output_maps) {
        std::unordered_map<Gate, bool, GateHash> output_map = out_map;
        // For every connection in the solution...
        for (std::pair<Gate, std::vector<Gate>> connection : given_solution) {
            // If the first value (what is being connected to) is a not gate...
            if (connection.first.gtype == NOT_GATE) {
                // Add the output value of the not gate with respect to the value connected to it into the output map
                bool output_value = connection.first.get_out_value(
                        (not connection.second.empty()) && output_map[connection.second[0]],
                        false
                );
                output_map[connection.first] = output_value;

                // If the first value is anything else than an input, output, or not gate (and, or, xor)...
            } else if (connection.first.gtype != OUTPUT and connection.first.gtype != INPUT) {
                // Add the output value of the gate with respect to the values connected to it into the output map
                bool output_value = connection.first.get_out_value(
                        (not connection.second.empty()) && output_map[connection.second[0]],
                        (connection.second.size() > 1) && output_map[connection.second[1]]
                );
                output_map[connection.first] = output_value;
            }
        }

        std::vector<bool> expected_outputs;
        std::vector<bool> actual_outputs;

        //std::cout << "----------------" << std::endl;
        //for (std::pair<Gate, bool> gate_pair : output_map) {
        //    std::cout << gate_pair.first.get_id() << ":" << gate_pair.second << std::endl;
        //}

        // For every connection in the solution...
        for (std::pair<Gate, std::vector<Gate>> connection : given_solution) {
            // If the thing being connected to is an output...
            if (connection.first.gtype == OUTPUT) {
                // Check what the expected output is
                bool expected_output = output_map.at(connection.first);
                expected_outputs.push_back(expected_output);

                // Check what the actual output of the value connected to it was
                bool actual_output = (not connection.second.empty()) && output_map.at(connection.second[0]);
                actual_outputs.push_back(actual_output);
            }
        }

        cost += manhattan_distance(actual_outputs, expected_outputs);
    }

    // We return the cost.
    return cost;
}

std::vector<std::vector<std::pair<Gate, std::vector<Gate>>>> find_continuations(
        const std::vector<std::pair<Gate, std::vector<Gate>>>& connections,
        const Gate& new_gate
) {
    std::vector<std::vector<std::pair<Gate, std::vector<Gate>>>> continuations;

    for (const std::pair<Gate, std::vector<Gate>>& connection : connections) {
        Gate gate_connecting = connection.first;

        if (gate_connecting.get_availability()) {
            std::vector<Gate> existing_connections = connection.second;
            Gate new_gate_copy = new_gate;
            existing_connections.push_back(new_gate_copy);

            Gate gate_connecting_copy = gate_connecting;
            gate_connecting_copy.add_connection();

            std::pair<Gate, std::vector<Gate>> connection_pair(gate_connecting_copy, existing_connections);
            std::vector<std::pair<Gate, std::vector<Gate>>> connections_copy = connections;
            connections_copy.erase(std::remove(connections_copy.begin(), connections_copy.end(), connection), connections_copy.end());
            connections_copy.push_back(connection_pair);

            if (new_gate_copy.gtype == NOT_GATE) {
                for (const std::pair<Gate, std::vector<Gate>>& primary : connections) {
                    if (primary.first.get_id() != new_gate_copy.get_id() and primary.first.gtype != OUTPUT) {
                        Gate gate_copy = new_gate_copy;
                        gate_copy.add_connection();
                        std::pair<Gate, std::vector<Gate>> new_gate_connection_pair(gate_copy, {primary.first});

                        std::vector<std::pair<Gate, std::vector<Gate>>> copy_connections = connections_copy;

                        copy_connections.push_back(new_gate_connection_pair);
                        continuations.push_back(copy_connections);
                    }
                }

            } else {
                for (const std::pair<Gate, std::vector<Gate>>& primary : connections) {
                    if (primary.first.get_id() != new_gate_copy.get_id() and primary.first.gtype != OUTPUT) {
                        Gate gate_copy = new_gate_copy;
                        gate_copy.add_connection();
                        std::pair<Gate, std::vector<Gate>> pre_gate_connection_pair(gate_copy, {primary.first});

                        std::vector<std::pair<Gate, std::vector<Gate>>> pre_connections = connections_copy;
                        pre_connections.push_back(pre_gate_connection_pair);
                        continuations.push_back(pre_connections);

                        for (const std::pair<Gate, std::vector<Gate>>& secondary : connections) {
                            if (secondary.first.get_id() != new_gate_copy.get_id() and secondary.first.get_id() != primary.first.get_id() and secondary.first.gtype != OUTPUT) {
                                Gate copy_gate = gate_copy;
                                copy_gate.add_connection();
                                std::pair<Gate, std::vector<Gate>> gate_connection_pair(copy_gate, {primary.first, secondary.first});

                                std::vector<std::pair<Gate, std::vector<Gate>>> copy_connections = connections_copy;
                                copy_connections.push_back(gate_connection_pair);

                                continuations.push_back(copy_connections);
                            }
                        }
                    }
                }
            }
        }

        if (gate_connecting.gtype != OUTPUT) {
            Gate gate_to_use = new_gate;
            Gate gate_connecting_copy = gate_connecting;

            if (gate_to_use.gtype == NOT_GATE) {
                gate_to_use.add_connection();
                std::pair<Gate, std::vector<Gate>> connection_pair(gate_to_use, {gate_connecting_copy});

                std::vector<std::pair<Gate, std::vector<Gate>>> connections_copy = connections;

                connections_copy.push_back(connection_pair);
                continuations.push_back(connections_copy);

            } else {
                gate_to_use.add_connection();

                for (const std::pair<Gate, std::vector<Gate>>& connection_for_alternatives : connections) {
                    if (connection_for_alternatives.first.get_id() != gate_to_use.get_id() and connection_for_alternatives.first.get_id() != gate_connecting_copy.get_id() and connection_for_alternatives.first.gtype != OUTPUT) {
                        std::pair<Gate, std::vector<Gate>> connection_pair(gate_to_use, {gate_connecting_copy});

                        gate_to_use.add_connection();
                        connection_pair.second.push_back(connection_for_alternatives.first);
                        std::vector<std::pair<Gate, std::vector<Gate>>> connections_copy = connections;

                        connections_copy.push_back(connection_pair);
                        continuations.push_back(connections_copy);
                    }
                }
            }
        }
    }

    return continuations;
}

struct Compare {
    bool operator()(const std::pair<int, std::vector<std::pair<Gate, std::vector<Gate>>>>& a,
                    const std::pair<int, std::vector<std::pair<Gate, std::vector<Gate>>>>& b) {
        return a.first > b.first;
    }
};
std::vector<std::pair<Gate, std::vector<Gate>>> find_solution(
        const std::vector<std::pair<Gate, std::vector<Gate>>>& current_connections,
        std::map<std::string, bool>& usable_gates,
        const std::vector<std::unordered_map<Gate, bool, GateHash>>& output_maps,
        bool use_manhattan_heuristic
) {
    // Initialize a priority queue with the comparator
    std::priority_queue<std::pair<int, std::vector<std::pair<Gate, std::vector<Gate>>>>,
            std::vector<std::pair<int, std::vector<std::pair<Gate, std::vector<Gate>>>>>,
            Compare> pq;
    // Push the initial state into the priority queue with a heuristic value of 0
    pq.emplace(0, current_connections);
    while (!pq.empty()) {
        // Pop the state with the lowest heuristic value
        auto [heuristic_value, connections] = pq.top();
        pq.pop();

        std::vector<Gate> new_possible_gates;
        if (usable_gates["not"]) { new_possible_gates.emplace_back(NOT_GATE); }
        if (usable_gates["and"]) { new_possible_gates.emplace_back(AND_GATE); }
        if (usable_gates["or"]) { new_possible_gates.emplace_back(OR_GATE); }
        if (usable_gates["xor"]) { new_possible_gates.emplace_back(XOR_GATE); }

        // Generate all possible continuations of the current state
        for (Gate gate : new_possible_gates) {
            //std::cout << "<><><><><><><><><><><><><><><><><><><><><><><><><><><><><>" << std::endl;
            for (const auto& continuation : find_continuations(connections, gate)) {
                // Calculate the heuristic value of the continuation
                int new_heuristic_value = calculate_heuristic(continuation, output_maps);
                if (new_heuristic_value == 0) {
                    return continuation;
                }

                //std::cout << "------------- HEURISTIC: " << new_heuristic_value << " ----------------" << std::endl;
                //for (auto connection : continuation) {
                //    std::cout << connection.first.get_id() << " * ";
                //    for (Gate gate : connection.second) {
                //        std::cout << gate.get_id() << ",";
                //    }
                //    std::cout << std::endl;
                //}

                // Push the continuation into the priority queue with its heuristic value
                pq.emplace(0, continuation);
            }
        }
    }
    // If no solution was found, return an empty vector
    return {};
}

int main() {
    std::map<std::string, bool> logic_gates = {
            {"and", true},
            {"not", true},
            {"xor", true},
            {"or", true}
    };

    std::map<std::string, std::string> truth_table = {};

    std::ifstream inputFile(R"(C:\Users\theod\CLionProjects\untitled\input.txt)");
    if (!inputFile.is_open()) {
        std::cerr << "Error opening the file!" << std::endl;
        return 1;
    }

    bool manhattan;

    std::string line;
    bool doing_truth_table = false;
    std::string left_side;
    std::string right_side;
    while (getline(inputFile, line)) {
        if (not doing_truth_table) {
            if (line.find("Manhattan:") != std::string::npos) {
                (line.find("true") != std::string::npos) ? manhattan = true : manhattan = false;
            } else if (line.find("AND:") != std::string::npos) {
                (line.find("true") != std::string::npos) ? logic_gates["and"] = true : logic_gates["and"] = false;
            } else if (line.find("NOT:") != std::string::npos) {
                (line.find("true") != std::string::npos) ? logic_gates["not"] = true : logic_gates["not"] = false;
            } else if (line.find("OR:") != std::string::npos) {
                (line.find("true") != std::string::npos) ? logic_gates["or"] = true : logic_gates["or"] = false;
            } else if (line.find("XOR:") != std::string::npos) {
                (line.find("true") != std::string::npos) ? logic_gates["xor"] = true : logic_gates["xor"] = false;
            } else if (line.find("Truth table (in:out):") != std::string::npos) {
                doing_truth_table = true;
            }
        } else {
            bool colon_found = false;
            left_side = "";
            right_side = "";

            for (char character : line) {
                if (character == ':') {
                    colon_found = true;
                    continue;
                }
                colon_found ? right_side += character : left_side += character;
            }

            truth_table[left_side] = right_side;
        }
    }

    std::vector<std::pair<Gate, std::vector<Gate>>> past_solution;
    std::vector<std::unordered_map<Gate, bool, GateHash>> output_maps;
    std::vector<Gate> current_gates;
    for (int i = 0; i < left_side.length(); i++) {
        Gate in_gate = Gate(INPUT);
        current_gates.push_back(in_gate);

        std::pair<Gate, std::vector<Gate>> gate_pair(in_gate, {});
        past_solution.push_back(gate_pair);
    }

    for (int i = 0; i < right_side.length(); i++) {
        Gate out_gate = Gate(OUTPUT);
        current_gates.push_back(out_gate);

        std::pair<Gate, std::vector<Gate>> gate_pair(out_gate, {});
        past_solution.push_back(gate_pair);
    }

    for (std::pair<std::string, std::string> truth_table_pair : truth_table) {
        std::unordered_map<Gate, bool, GateHash> output_map;
        int i = 0;
        int o = 0;
        for (Gate gate : current_gates) {
            if (gate.gtype == INPUT) {
                std::string value(1, truth_table_pair.first[i]);
                output_map[gate] = std::stoi(value);

                i++;

            } else if (gate.gtype == OUTPUT) {
                std::string value(1, truth_table_pair.second[o]);
                output_map[gate] = std::stoi(value);

                o++;
            }
        }
        output_maps.push_back(output_map);
    }

    std::vector<std::pair<Gate, std::vector<Gate>>> solution = find_solution(past_solution, logic_gates, output_maps, manhattan);

    for (const std::pair<Gate, std::vector<Gate>>& pair : solution) {
        for (Gate gate : pair.second) {
            std::cout << gate.get_id() << ",";
        }
        std::cout << " -> " << pair.first.get_id() << std::endl;
    }

    inputFile.close();
    return 0;
}